import type {
  OpportunitySignal,
  PropertyIntelProvider,
  PropertyIntelResult,
  PropertyLookupParams,
} from "./types";

/**
 * Deterministic, clearly-labeled mock data for development and testing.
 * No real property data provider is connected in Phase 1
 * (docs/architecture/phase-1-implementation-spec.md #16).
 */
export class MockPropertyIntelProvider implements PropertyIntelProvider {
  async lookupProperty(params: PropertyLookupParams): Promise<PropertyIntelResult> {
    // Deterministic pseudo-randomness from the address so the same input
    // always returns the same mock output in tests.
    const seed = hashString(`${params.addressLine1}${params.zip}`);
    const estimatedValue = 12_000_000 + (seed % 8_000_000); // $120k-$200k, in cents
    const mortgageBalance = Math.floor(estimatedValue * (0.4 + (seed % 40) / 100));

    return {
      isMockData: true,
      estimatedValue,
      mortgageBalance,
      mortgageRateBps: 600 + (seed % 250),
      estimatedEquity: estimatedValue - mortgageBalance,
      estimatedLtv: Math.round((mortgageBalance / estimatedValue) * 100),
      purchaseDate: "2019-06-01",
    };
  }

  detectOpportunities(result: PropertyIntelResult): OpportunitySignal[] {
    const signals: OpportunitySignal[] = [];
    if ((result.estimatedLtv ?? 100) < 80) signals.push("CASH_OUT", "HELOC");
    if ((result.mortgageRateBps ?? 0) > 700) signals.push("RATE_REDUCTION", "REFINANCE");
    if ((result.estimatedEquity ?? 0) > 5_000_000) signals.push("EQUITY");
    signals.push("ANNUAL_REVIEW");
    return signals;
  }
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}
