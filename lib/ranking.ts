import type { Cycle, DisplayCurrency, Market, PricedMarket, Rates, Tier } from "./types";
import { priceMarket } from "./money";

const BASKET_REPRESENTATIVE: Record<string, string> = {
  usd_basket: "US",
  eur_basket: "FR",
  gbp_basket: "GB",
  chf_basket: "CH",
};

export function listedMarkets(markets: Market[]): Market[] {
  return markets.filter((market) => market.availability === "listed" && market.prices);
}

export function priceAll(
  markets: Market[],
  tier: Tier,
  cycle: Cycle,
  display: DisplayCurrency,
  rates: Rates,
): PricedMarket[] {
  const priced: PricedMarket[] = [];
  for (const market of listedMarkets(markets)) {
    const row = priceMarket(market, tier, cycle, display, rates);
    if (row) priced.push(row);
  }
  return priced;
}

export function rankUnique(priced: PricedMarket[]): Array<PricedMarket & { samePriceCount: number }> {
  const groups = new Map<string, PricedMarket[]>();
  for (const row of priced) {
    const key =
      row.pricingGroup === "localized"
        ? `local:${row.iso2}`
        : `${row.pricingGroup}:${row.localAmount}:${row.currency}`;
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }

  const collapsed: Array<PricedMarket & { samePriceCount: number }> = [];
  for (const list of groups.values()) {
    const representativeIso = BASKET_REPRESENTATIVE[list[0].pricingGroup];
    const representative =
      list.find((row) => row.iso2 === representativeIso) ??
      [...list].sort((a, b) => a.nameZh.localeCompare(b.nameZh, "zh"))[0];
    collapsed.push({ ...representative, samePriceCount: list.length });
  }

  return collapsed.sort((a, b) => a.usdAmount - b.usdAmount);
}

export function vsUnitedStates(row: PricedMarket, us: PricedMarket | undefined): number | null {
  if (!us || us.usdAmount === 0) return null;
  return row.usdAmount / us.usdAmount - 1;
}
