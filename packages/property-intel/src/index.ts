export type {
  PropertyLookupParams,
  PropertyIntelResult,
  OpportunitySignal,
  PropertyIntelProvider,
} from "./types";
export { MockPropertyIntelProvider } from "./mock-provider";

import { MockPropertyIntelProvider } from "./mock-provider";
import type { PropertyIntelProvider } from "./types";

/** Phase 1 always returns the Mock provider — no real data provider is connected. */
export function getPropertyIntelProvider(): PropertyIntelProvider {
  return new MockPropertyIntelProvider();
}
