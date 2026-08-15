import type { AiCompletionRequest, AiCompletionResult, AiProvider } from "./types";

/** Phase 1 default — no live Claude API calls. Throws if actually invoked, since no caller should be running agents yet. */
export class NoopAiProvider implements AiProvider {
  async complete(request: AiCompletionRequest): Promise<AiCompletionResult> {
    throw new Error(
      `AI agents are not active in Phase 1 (attempted to invoke ${request.agentName}). See docs/architecture/phase-1-implementation-spec.md #16.`,
    );
  }
}
