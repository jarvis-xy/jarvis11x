import catalog from "@/data/markets.json";
import type { Catalog, Market } from "./types";

export const CATALOG = catalog as Catalog;

export const MARKETS: Market[] = CATALOG.markets;

export const MARKET_BY_ISO = Object.fromEntries(MARKETS.map((market) => [market.iso2, market]));

export const MARKET_BY_NUMERIC = Object.fromEntries(
  MARKETS.filter((market) => market.numeric).map((market) => [market.numeric.replace(/^0+/, ""), market]),
);

export const US_MARKET = MARKET_BY_ISO.US;
