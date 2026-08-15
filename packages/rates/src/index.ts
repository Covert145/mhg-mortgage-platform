export type { RateQuoteParams, RateQuote, RateProvider } from "./types";
export { MockRateProvider } from "./mock-provider";

import { MockRateProvider } from "./mock-provider";
import type { RateProvider } from "./types";

/** Phase 1 always returns the Mock provider — no live rate feed is connected. */
export function getRateProvider(): RateProvider {
  return new MockRateProvider();
}
