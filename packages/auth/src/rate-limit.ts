/**
 * Rate limiting for auth endpoints (login, registration, password reset) —
 * docs/architecture/security-architecture.md #1: "5 attempts / 15 min per
 * IP+email combination."
 *
 * Backed by Upstash Redis when UPSTASH_REDIS_REST_URL/TOKEN are configured
 * (staging/prod). Falls back to an in-memory limiter otherwise, so local
 * development and tests work without a real Upstash account — this is a
 * deliberate Phase 1 choice, not a production posture (an in-memory limiter
 * does not work across multiple server instances).
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export interface RateLimiter {
  /** Returns true if the request is allowed, false if the limit is exceeded. */
  check(key: string): Promise<boolean>;
}

class InMemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, { count: number; resetAt: number }>();

  async check(key: string): Promise<boolean> {
    const now = Date.now();
    const entry = this.hits.get(key);
    if (!entry || entry.resetAt < now) {
      this.hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return true;
    }
    if (entry.count >= MAX_ATTEMPTS) {
      return false;
    }
    entry.count += 1;
    return true;
  }
}

class UpstashRateLimiter implements RateLimiter {
  constructor(
    private readonly url: string,
    private readonly token: string,
  ) {}

  async check(key: string): Promise<boolean> {
    // Fixed-window counter via Upstash's REST API (INCR + EXPIRE), avoiding
    // a hard dependency on the @upstash/ratelimit SDK for Phase 1.
    const incrRes = await fetch(`${this.url}/incr/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    const { result: count } = (await incrRes.json()) as { result: number };
    if (count === 1) {
      await fetch(`${this.url}/expire/${encodeURIComponent(key)}/${Math.floor(WINDOW_MS / 1000)}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
    }
    return count <= MAX_ATTEMPTS;
  }
}

let cachedLimiter: RateLimiter | undefined;

export function getRateLimiter(): RateLimiter {
  if (cachedLimiter) return cachedLimiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  cachedLimiter = url && token ? new UpstashRateLimiter(url, token) : new InMemoryRateLimiter();
  return cachedLimiter;
}

export function authRateLimitKey(scope: "login" | "register" | "reset-password", ip: string, email: string) {
  return `auth:${scope}:${ip}:${email.toLowerCase()}`;
}
