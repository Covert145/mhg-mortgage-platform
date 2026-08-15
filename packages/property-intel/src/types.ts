/**
 * Provider-agnostic property intelligence interface — see
 * docs/architecture/system-architecture.md #1. Never claim live property
 * data until a real provider (e.g. ATTOM/CoreLogic/Estated) is connected;
 * Phase 1 ships this interface plus a MockProvider only.
 */

export interface PropertyLookupParams {
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
}

export interface PropertyIntelResult {
  /** Always true for the MockProvider — callers must not treat mock data as real. */
  isMockData: boolean;
  ownerName?: string;
  estimatedValue?: number; // integer cents
  purchasePrice?: number; // integer cents
  purchaseDate?: string; // ISO date
  mortgageBalance?: number; // integer cents
  mortgageRateBps?: number; // basis points
  estimatedEquity?: number; // integer cents
  estimatedLtv?: number; // percent, 0-100
}

export type OpportunitySignal =
  | "REFINANCE"
  | "CASH_OUT"
  | "HELOC"
  | "EQUITY"
  | "RATE_REDUCTION"
  | "ANNUAL_REVIEW";

export interface PropertyIntelProvider {
  lookupProperty(params: PropertyLookupParams): Promise<PropertyIntelResult | null>;
  detectOpportunities(result: PropertyIntelResult): OpportunitySignal[];
}
