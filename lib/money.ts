import type { Cycle, DisplayCurrency, Market, PricedMarket, Rates, Tier } from "./types";

const ZERO_DECIMAL = new Set([
  "JPY",
  "KRW",
  "VND",
  "CLP",
  "COP",
  "HUF",
  "IDR",
  "ISK",
  "TWD",
  "KZT",
  "NGN",
  "TZS",
]);

export function toUsd(amount: number, currency: string, rates: Rates): number | null {
  const perUsd = rates.usd[currency];
  if (!perUsd) return null;
  return amount / perUsd;
}

export function fromUsd(usdAmount: number, currency: string, rates: Rates): number | null {
  const perUsd = rates.usd[currency];
  if (!perUsd) return null;
  return usdAmount * perUsd;
}

export function marketAmount(market: Market, tier: Tier, cycle: Cycle): number | null {
  if (!market.prices) return null;
  return market.prices[tier][cycle];
}

export function priceMarket(
  market: Market,
  tier: Tier,
  cycle: Cycle,
  display: DisplayCurrency,
  rates: Rates,
): PricedMarket | null {
  if (!market.prices || !market.currency) return null;
  const localAmount = market.prices[tier][cycle];
  const yearLocal = market.prices[tier].year;
  const monthLocal = market.prices[tier].month;
  const usdAmount = toUsd(localAmount, market.currency, rates);
  const yearUsd = toUsd(yearLocal, market.currency, rates);
  const monthUsd = toUsd(monthLocal, market.currency, rates);
  if (usdAmount == null || yearUsd == null || monthUsd == null) return null;
  const displayAmount = display === "USD" ? usdAmount : fromUsd(usdAmount, "CNY", rates);
  const yearDisplay = display === "USD" ? yearUsd : fromUsd(yearUsd, "CNY", rates);
  const monthDisplay = display === "USD" ? monthUsd : fromUsd(monthUsd, "CNY", rates);
  if (displayAmount == null || yearDisplay == null || monthDisplay == null) return null;
  const equivalentMonthDisplay = yearDisplay / 12;
  const annualSaveDisplay = monthDisplay * 12 - yearDisplay;
  const annualSavePct = monthDisplay * 12 > 0 ? annualSaveDisplay / (monthDisplay * 12) : 0;

  return {
    ...market,
    localAmount,
    usdAmount,
    displayAmount,
    yearLocal,
    yearUsd,
    yearDisplay,
    equivalentMonthDisplay,
    annualSaveDisplay,
    annualSavePct,
  };
}

export function formatMoney(amount: number, currency: string): string {
  const digits = ZERO_DECIMAL.has(currency) ? 0 : amount >= 100 ? 0 : 2;
  try {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency,
      currencyDisplay: currency === "CNY" || currency === "USD" ? "narrowSymbol" : "code",
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    }).format(amount);
  } catch {
    return `${amount.toFixed(digits)} ${currency}`;
  }
}

export function formatSignedPct(value: number): string {
  const pct = Math.round(value * 1000) / 10;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct}%`;
}

export const TIER_LABEL: Record<Tier, string> = {
  basic: "Basic",
  premium: "Premium",
  plus: "Premium+",
};

export const CYCLE_LABEL: Record<Cycle, string> = {
  month: "月付",
  year: "年付",
};

export const GROUP_LABEL: Record<string, string> = {
  localized: "本地化标价",
  usd_basket: "美元同价",
  eur_basket: "欧元同价",
  gbp_basket: "英镑同价",
  chf_basket: "法郎同价",
  unpublished: "官方未列出",
};
