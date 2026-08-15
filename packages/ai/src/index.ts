export type {
  AiAgentName,
  AiToolName,
  AiAgentConfig,
  AiCompletionRequest,
  AiCompletionResult,
  AiProvider,
} from "./types";
export { AGENT_REGISTRY } from "./agent-registry";
export { NoopAiProvider } from "./noop-provider";

import { NoopAiProvider } from "./noop-provider";
import type { AiProvider } from "./types";

/** Phase 1 always returns the Noop provider — no ANTHROPIC_API_KEY is configured yet (see .env.example). */
export function getAiProvider(): AiProvider {
  return new NoopAiProvider();
}
