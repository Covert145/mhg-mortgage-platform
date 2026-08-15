import type { RateProvider, RateQuote, RateQuoteParams } from "./types";

/** Deterministic, clearly-labeled mock rates. No live rate feed in Phase 1. */
export class MockRateProvider implements RateProvider {
  async getRates(params: RateQuoteParams): Promise<RateQuote[]> {
    const base = params.program === "CHATTEL" ? 750 : 650; // basis points
    const today = new Date().toISOString().slice(0, 10);

    return [0, 25, 50].map((buyDown) => ({
      isMockData: true,
      program: params.program,
      rateBps: base - buyDown,
      aprBps: base - buyDown + 35,
      points: buyDown / 25,
      feesCents: 150_000,
      termMonths: params.termMonths,
      effectiveDate: today,
    }));
  }
}
