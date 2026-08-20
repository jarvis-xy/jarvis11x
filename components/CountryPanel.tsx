"use client";

import { useLocale } from "@/components/LocaleProvider";
import { MARKET_BY_ISO } from "@/lib/catalog";
import { cycleLabel, marketName } from "@/lib/i18n";
import { formatMoney, formatSignedPct, TIER_LABEL } from "@/lib/money";
import type { Cycle, DisplayCurrency, PricedMarket, Tier } from "@/lib/types";
import { vsUnitedStates } from "@/lib/ranking";

type Props = {
  iso: string;
  priced: PricedMarket | null;
  us: PricedMarket | undefined;
  display: DisplayCurrency;
  tier: Tier;
  cycle: Cycle;
  onClose: () => void;
};

const TIERS: Tier[] = ["basic", "premium", "plus"];

export function CountryPanel({ iso, priced, us, display, tier, cycle, onClose }: Props) {
  const { locale, t } = useLocale();
  const market = MARKET_BY_ISO[iso];
  if (!market) return null;
  const vsUs = priced ? vsUnitedStates(priced, us) : null;
  const localizedName = marketName(market, locale);

  return (
    <aside className="flex h-full flex-col bg-panel">
      <div className="flex items-start justify-between gap-3 border-b border-rule px-4 py-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">{iso}</div>
          <h2 className="font-display text-2xl leading-tight text-cream">{localizedName}</h2>
          {locale !== "en" ? <div className="text-sm text-mute">{market.nameEn}</div> : null}
        </div>
        <button type="button" className="font-mono text-xs text-amber hover:text-cream" onClick={onClose}>
          {t("close")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {market.availability === "unpublished" || !market.prices || !market.currency ? (
          <p className="text-sm leading-6 text-cream">{t("unpublished")}</p>
        ) : (
          <>
            <div className="mb-4 border border-rule bg-white px-3 py-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
                {TIER_LABEL[tier]} · {cycleLabel(locale, cycle)}
              </div>
              <div className="mt-1 font-mono text-3xl text-amber">
                {formatMoney(priced?.localAmount ?? market.prices[tier][cycle], market.currency, locale)}
              </div>
              <div className="mt-1 font-mono text-sm text-cream">
                {priced ? formatMoney(priced.displayAmount, display, locale) : t("noRate")}
              </div>
              {vsUs != null ? (
                <div className="mt-2 text-sm text-mute">{t("vsUs", { pct: formatSignedPct(vsUs) })}</div>
              ) : null}
            </div>

            <table className="mb-4 w-full text-left text-sm">
              <thead className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                <tr>
                  <th className="pb-2 font-medium">{t("colTier")}</th>
                  <th className="pb-2 font-medium">{cycleLabel(locale, "month")}</th>
                  <th className="pb-2 font-medium">{cycleLabel(locale, "year")}</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((rowTier) => (
                  <tr key={rowTier} className={rowTier === tier ? "text-amber" : "text-cream"}>
                    <td className="py-1.5">{TIER_LABEL[rowTier]}</td>
                    <td className="py-1.5 font-mono">{formatMoney(market.prices![rowTier].month, market.currency!, locale)}</td>
                    <td className="py-1.5 font-mono">{formatMoney(market.prices![rowTier].year, market.currency!, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {priced ? (
              <div className="space-y-1 text-sm text-mute">
                <p>{t("annualMonthFee", { price: formatMoney(priced.equivalentMonthDisplay, display, locale) })}</p>
                <p>
                  {t("annualSave", {
                    price: formatMoney(priced.annualSaveDisplay, display, locale),
                    pct: formatSignedPct(priced.annualSavePct),
                  })}
                </p>
              </div>
            ) : null}
          </>
        )}

        {market.notes.length > 0 ? (
          <ul className="mt-4 list-disc space-y-1 pl-4 text-sm text-mute">
            {market.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </aside>
  );
}
