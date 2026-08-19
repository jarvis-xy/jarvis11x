import fallback from "@/data/rates-fallback.json";
import type { Rates } from "./types";

const FALLBACK = fallback as Rates;

export async function loadRates(): Promise<Rates> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return FALLBACK;
    const body = (await response.json()) as {
      result: string;
      time_last_update_utc: string;
      rates: Record<string, number>;
    };
    if (body.result !== "success" || !body.rates?.CNY) return FALLBACK;
    return { date: body.time_last_update_utc, usd: body.rates };
  } catch {
    return FALLBACK;
  }
}
