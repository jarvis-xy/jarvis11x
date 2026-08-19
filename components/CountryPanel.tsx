"use client";

import { MARKET_BY_ISO } from "@/lib/catalog";
import { CYCLE_LABEL, formatMoney, formatSignedPct, TIER_LABEL } from "@/lib/money";
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
  const market = MARKET_BY_ISO[iso];
  if (!market) return null;
  const vsUs = priced ? vsUnitedStates(priced, us) : null;

  return (
    <aside className="flex h-full flex-col border-l border-rule bg-panel">
      <div className="flex items-start justify-between gap-3 border-b border-rule px-4 py-3">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">{iso}</div>
          <h2 className="font-display text-2xl leading-tight text-cream">{market.nameZh}</h2>
          <div className="text-sm text-mute">{market.nameEn}</div>
        </div>
        <button type="button" className="font-mono text-xs text-amber hover:text-cream" onClick={onClose}>
          关闭
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {market.availability === "unpublished" || !market.prices || !market.currency ? (
          <p className="text-sm leading-6 text-cream">
            本站暂未收录该市场标价，因此没有可换算的数字。
          </p>
        ) : (
          <>
            <div className="mb-4 border border-rule bg-white px-3 py-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
                {TIER_LABEL[tier]} · {CYCLE_LABEL[cycle]}
              </div>
              <div className="mt-1 font-mono text-3xl text-amber">
                {formatMoney(priced?.localAmount ?? market.prices[tier][cycle], market.currency)}
              </div>
              <div className="mt-1 font-mono text-sm text-cream">
                {priced ? formatMoney(priced.displayAmount, display) : "无汇率"}
              </div>
              {vsUs != null ? (
                <div className="mt-2 text-sm text-mute">相对美国 {formatSignedPct(vsUs)}</div>
              ) : null}
            </div>

            <table className="mb-4 w-full text-left text-sm">
              <thead className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                <tr>
                  <th className="pb-2 font-medium">档位</th>
                  <th className="pb-2 font-medium">月付</th>
                  <th className="pb-2 font-medium">年付</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((rowTier) => (
                  <tr key={rowTier} className={rowTier === tier ? "text-amber" : "text-cream"}>
                    <td className="py-1.5">{TIER_LABEL[rowTier]}</td>
                    <td className="py-1.5 font-mono">{formatMoney(market.prices![rowTier].month, market.currency!)}</td>
                    <td className="py-1.5 font-mono">{formatMoney(market.prices![rowTier].year, market.currency!)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {priced ? (
              <div className="space-y-1 text-sm text-mute">
                <p>年付等效月费 {formatMoney(priced.equivalentMonthDisplay, display)}</p>
                <p>
                  相对 12 个月付可少付 {formatMoney(priced.annualSaveDisplay, display)}（
                  {formatSignedPct(priced.annualSavePct)}）
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
