import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/nodemailer";
import { z } from "zod";
// Raw prisma import is allowed here — see packages/config's
// no-unscoped-prisma rule: packages/auth is a deliberate exception because
// the Auth.js adapter operates on global identity tables (User/Account/
// Session), which are not organization-scoped and must be queryable before
// any org context exists (e.g. looking a user up by email at login).
import { prisma } from "@mhg/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Auth.js v5 configuration.
 *
 * Session strategy is JWT, not database — discovered during Phase 1
 * implementation that Auth.js's Credentials provider does not create an
 * adapter-backed database session regardless of `session.strategy`
 * (confirmed by an empty `sessions` table after a successful Credentials
 * sign-in): the Credentials provider is documented upstream as JWT-only.
 * This is a real constraint, not a preference — see
 * docs/architecture/security-architecture.md #1 for the updated posture
 * and the instant-revocation follow-up this implies (a short maxAge here
 * plus a future `User.sessionInvalidatedAt` check in the jwt callback,
 * tracked alongside the already-deferred MFA enforcement work).
 * The PrismaAdapter is still used for the Email (magic-link) provider and
 * for Account linkage.
 */
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  // Without this, `next start` (production mode) refuses to trust the host
  // header and silently fails to persist the session cookie over plain
  // HTTP — reproduced during Phase 1 e2e testing against a production
  // build on http://localhost. Real deployments (Vercel) terminate TLS in
  // front of the app, so the host header is trustworthy there too; this is
  // not a security regression, just Auth.js's production-mode default
  // being conservative about proxied/non-HTTPS hosts.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.hashedPassword) return null;

        const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatches) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    // Magic-link login. In Phase 1 this uses a dev-mode console transport —
    // no real email provider is wired up yet (see
    // docs/architecture/phase-1-implementation-spec.md #14/#16). Swapping in
    // Resend/Postmark in Phase 5 only requires changing sendVerificationRequest.
    Email({
      // Never actually connected to — sendVerificationRequest below
      // short-circuits before any SMTP transport is created. Auth.js's
      // Nodemailer provider requires a `server` value to be present at
      // config-parse time regardless, so this is an inert placeholder.
      server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
      from: "no-reply@dev.mhg.internal",
      sendVerificationRequest: async ({ identifier, url }) => {
        // eslint-disable-next-line no-console
        console.log(`[dev-email] Magic link for ${identifier}: ${url}`);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
