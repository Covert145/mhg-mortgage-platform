/**
 * Provider-agnostic mortgage rate engine interface — see
 * docs/architecture/system-architecture.md #1. Never hard-code production
 * mortgage rates; Phase 1 ships this interface plus a MockProvider only.
 */

export interface RateQuoteParams {
  program: string; // e.g. "CHATTEL", "LAND_HOME", "CONVENTIONAL"
  state: string;
  propertyType: string;
  occupancyType: string;
  termMonths: number;
}

export interface RateQuote {
  /** Always true for the MockProvider — callers must not present mock quotes as real offers. */
  isMockData: boolean;
  program: string;
  rateBps: number; // basis points
  aprBps: number; // basis points
  points: number;
  feesCents: number;
  termMonths: number;
  effectiveDate: string; // ISO date
}

export interface RateProvider {
  getRates(params: RateQuoteParams): Promise<RateQuote[]>;
}
