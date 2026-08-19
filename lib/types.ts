export type Tier = "basic" | "premium" | "plus";
export type Cycle = "month" | "year";
export type DisplayCurrency = "CNY" | "USD";
export type PricingGroup =
  | "localized"
  | "usd_basket"
  | "eur_basket"
  | "gbp_basket"
  | "chf_basket"
  | "unpublished";

export type MarketPrices = {
  basic: { month: number; year: number };
  premium: { month: number; year: number };
  plus: { month: number; year: number };
};

export type Market = {
  iso2: string;
  iso3: string;
  numeric: string;
  nameEn: string;
  nameZh: string;
  currency: string | null;
  availability: "listed" | "unpublished";
  pricingGroup: PricingGroup;
  prices: MarketPrices | null;
  notes: string[];
};

export type Catalog = {
  source: {
    title: string;
    url: string;
    officialUpdatedAt: string;
    channel: string;
    disclaimer: string;
  };
  generatedAt: string;
  markets: Market[];
};

export type Rates = {
  date: string;
  usd: Record<string, number>;
};

export type PricedMarket = Market & {
  localAmount: number;
  usdAmount: number;
  displayAmount: number;
  yearLocal: number;
  yearUsd: number;
  yearDisplay: number;
  equivalentMonthDisplay: number;
  annualSaveDisplay: number;
  annualSavePct: number;
};
