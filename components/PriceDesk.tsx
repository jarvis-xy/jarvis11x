"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CountryPanel } from "@/components/CountryPanel";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/components/LocaleProvider";
import { SiteLogo } from "@/components/SiteLogo";
import { XBylineBadge, XHandleLink } from "@/components/XHandleLink";
import { cycleLabel, groupLabel, marketName } from "@/lib/i18n";
import { formatMoney, formatSignedPct, TIER_LABEL } from "@/lib/money";
import { isUnitedStatesBaseline, priceAll, rankUnique, vsUnitedStates } from "@/lib/ranking";
import { XPRICE_METHODOLOGY_PATH, XPRICE_PATH } from "@/lib/site";
import type { Catalog, Cycle, DisplayCurrency, PricedMarket, Rates, Tier } from "@/lib/types";

function MapLoading() {
  const { t } = useLocale();
  return <div className="flex h-[42vw] min-h-[240px] items-center justify-center text-sm text-mute">{t("mapLoading")}</div>;
}

const WorldMap = dynamic(() => import("@/components/WorldMap").then((mod) => mod.WorldMap), {
  ssr: false,
  loading: () => <MapLoading />,
});

const TIERS: Tier[] = ["basic", "premium", "plus"];
const CYCLES: Cycle[] = ["month", "year"];

type Props = {
  catalog: Catalog;
  rates: Rates;
};

export function PriceDesk({ catalog, rates }: Props) {
  const { locale, t } = useLocale();
  const [tier, setTier] = useState<Tier>("premium");
  const [cycle, setCycle] = useState<Cycle>("month");
  const [display, setDisplay] = useState<DisplayCurrency>("CNY");
  const [query, setQuery] = useState("");
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [usBasketOpen, setUsBasketOpen] = useState(false);
  const money = (amount: number, currency: string) => formatMoney(amount, currency, locale);

  const priced = useMemo(
    () => priceAll(catalog.markets, tier, cycle, display, rates),
    [catalog.markets, cycle, display, rates, tier],
  );
  const ranked = useMemo(() => rankUnique(priced), [priced]);
  const tableRows = useMemo(
    () =>
      [...priced].sort(
        (a, b) => a.usdAmount - b.usdAmount || marketName(a, locale).localeCompare(marketName(b, locale), locale),
      ),
    [locale, priced],
  );
  const us = priced.find((row) => row.iso2 === "US");
  const tableBlocks = useMemo(() => {
    const baseline = tableRows.filter((row) => isUnitedStatesBaseline(row, us));
    const others = tableRows.filter((row) => !isUnitedStatesBaseline(row, us));
    const orderedBaseline = [...baseline].sort((a, b) => {
      if (a.iso2 === "US") return -1;
      if (b.iso2 === "US") return 1;
      if (a.pricingGroup === "usd_basket" && b.pricingGroup !== "usd_basket") return -1;
      if (b.pricingGroup === "usd_basket" && a.pricingGroup !== "usd_basket") return 1;
      return marketName(a, locale).localeCompare(marketName(b, locale), locale);
    });
    const blocks: Array<{ type: "row"; row: PricedMarket } | { type: "us-basket"; rows: PricedMarket[] }> = [];
    const usAmount = us?.usdAmount ?? orderedBaseline[0]?.usdAmount ?? 0;
    let inserted = false;
    for (const row of others) {
      if (!inserted && row.usdAmount > usAmount) {
        if (orderedBaseline.length > 0) blocks.push({ type: "us-basket", rows: orderedBaseline });
        inserted = true;
      }
      blocks.push({ type: "row", row });
    }
    if (!inserted && orderedBaseline.length > 0) {
      blocks.push({ type: "us-basket", rows: orderedBaseline });
    }
    return blocks;
  }, [locale, tableRows, us]);
  const cheapest = ranked[0];
  const dearest = ranked[ranked.length - 1];
  const spread = cheapest && dearest && cheapest.usdAmount > 0 ? dearest.usdAmount / cheapest.usdAmount : null;
  const selected = priced.find((row) => row.iso2 === selectedIso) ?? null;

  useEffect(() => {
    if (!selectedIso) return;
    const row = priced.find((item) => item.iso2 === selectedIso);
    if (row && isUnitedStatesBaseline(row, us)) {
      setUsBasketOpen(true);
    }
  }, [priced, selectedIso, us]);

  const amounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of priced) map.set(row.iso2, row.usdAmount);
    return map;
  }, [priced]);

  const labels = useMemo(() => {
    const map = new Map<string, string>();
    for (const row of priced) {
      map.set(row.iso2, `${money(row.localAmount, row.currency ?? "USD")} · ${money(row.displayAmount, display)}`);
    }
    return map;
  }, [display, locale, priced]);

  const hits = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return catalog.markets
      .filter((market) => {
        const localized = marketName(market, locale).toLowerCase();
        return (
          market.iso2.toLowerCase().includes(needle) ||
          market.nameEn.toLowerCase().includes(needle) ||
          market.nameZh.toLowerCase().includes(needle) ||
          localized.includes(needle)
        );
      })
      .slice(0, 8);
  }, [catalog.markets, locale, query]);

  const ticker = ranked.filter((row) => row.pricingGroup === "localized").slice(0, 24);

  return (
    <div className="min-h-screen bg-white text-cream">
      <header className="border-b border-rule">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="inline-flex items-end font-display text-3xl tracking-tight">
            <Link href={XPRICE_PATH} className="inline-flex items-center gap-2.5">
              <SiteLogo className="h-8 w-8" />
              XPrice
            </Link>
            <XBylineBadge className="mb-1 ml-1.5" />
          </h1>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <LanguageSwitcher />
            <Segment
              value={tier}
              options={TIERS.map((value) => ({ value, label: TIER_LABEL[value] }))}
              onChange={setTier}
            />
            <Segment
              value={cycle}
              options={CYCLES.map((value) => ({ value, label: cycleLabel(locale, value) }))}
              onChange={setCycle}
            />
            <Segment
              value={display}
              options={[
                { value: "CNY", label: t("cny") },
                { value: "USD", label: t("usd") },
              ]}
              onChange={setDisplay}
            />
          </div>
        </div>
        <div className="relative overflow-hidden border-t border-rule bg-panel py-2">
          <div className="ticker-track flex w-max gap-8 whitespace-nowrap px-4 font-mono text-xs text-amber">
            {[...ticker, ...ticker].map((row, index) => (
              <span key={`${row.iso2}-${index}`}>
                {marketName(row, locale)} {money(row.displayAmount, display)}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-px border-b border-rule bg-rule md:grid-cols-4">
        <Stat
          label={t("cheapest")}
          value={cheapest ? marketName(cheapest, locale) : "—"}
          detail={cheapest ? money(cheapest.displayAmount, display) : ""}
        />
        <Stat
          label={t("dearest")}
          value={dearest ? marketName(dearest, locale) : "—"}
          detail={dearest ? money(dearest.displayAmount, display) : ""}
        />
        <Stat label={t("spread")} value={spread ? `${spread.toFixed(1)}×` : "—"} detail={t("spreadDetail")} />
        <Stat
          label={t("compiledAt")}
          value={formatRateDate(catalog.generatedAt)}
          detail={`${t("fx")} ${formatRateDate(rates.date)}`}
        />
      </section>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <div className="flex flex-col gap-3 border-b border-rule px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <label className="sr-only" htmlFor="country-search">
                {t("searchLabel")}
              </label>
              <input
                id="country-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full border border-rule bg-white px-3 py-2 text-sm text-cream placeholder:text-mute"
              />
              {hits.length > 0 ? (
                <ul className="absolute z-20 mt-1 w-full border border-rule bg-panel">
                  {hits.map((market) => (
                    <li key={market.iso2}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-raised"
                        onClick={() => {
                          setSelectedIso(market.iso2);
                          setQuery("");
                        }}
                      >
                        <span>{marketName(market, locale)}</span>
                        <span className="font-mono text-mute">{market.iso2}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <Legend />
          </div>
          <WorldMap amounts={amounts} labels={labels} selectedIso={selectedIso} onSelect={setSelectedIso} />
        </div>
        <div className="hidden min-h-[320px] lg:block">
          {selectedIso ? (
            <CountryPanel
              iso={selectedIso}
              priced={selected}
              us={us}
              display={display}
              tier={tier}
              cycle={cycle}
              onClose={() => setSelectedIso(null)}
            />
          ) : (
            <RankColumn
              cheapest={ranked.slice(0, 8)}
              dearest={[...ranked].reverse().slice(0, 8)}
              display={display}
              onSelect={setSelectedIso}
            />
          )}
        </div>
      </div>

      {selectedIso ? (
        <div className="lg:hidden">
          <CountryPanel
            iso={selectedIso}
            priced={selected}
            us={us}
            display={display}
            tier={tier}
            cycle={cycle}
            onClose={() => setSelectedIso(null)}
          />
        </div>
      ) : (
        <div className="grid gap-px bg-rule md:grid-cols-2 lg:hidden">
          <RankColumn cheapest={ranked.slice(0, 8)} dearest={[...ranked].reverse().slice(0, 8)} display={display} onSelect={setSelectedIso} />
        </div>
      )}

      <section className="border-t border-rule px-4 py-6">
        <div className="mb-4">
          <h2 className="font-display text-2xl">{t("tableTitle")}</h2>
          <p className="text-sm text-mute">{t("tableHint", { n: tableRows.length })}</p>
        </div>
        <div className="overflow-x-auto border border-rule">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-panel font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
              <tr>
                <th className="px-3 py-2 font-medium">{t("colMarket")}</th>
                <th className="px-3 py-2 font-medium">{t("colGroup")}</th>
                <th className="px-3 py-2 font-medium">{t("colLocal")}</th>
                <th className="px-3 py-2 font-medium">{display === "CNY" ? t("cny") : t("usd")}</th>
                <th className="px-3 py-2 font-medium">{t("colAnnualMonth")}</th>
                <th className="px-3 py-2 font-medium">{t("colUsDiscount")}</th>
              </tr>
            </thead>
            <tbody>
              {tableBlocks.map((block) => {
                if (block.type === "row") {
                  return (
                    <PriceRow
                      key={block.row.iso2}
                      row={block.row}
                      display={display}
                      us={us}
                      onSelect={setSelectedIso}
                    />
                  );
                }
                const representative = block.rows.find((row) => row.iso2 === "US") ?? block.rows[0];
                return (
                  <UsBasketRows
                    key="us-basket"
                    rows={block.rows}
                    representative={representative}
                    open={usBasketOpen}
                    display={display}
                    us={us}
                    onToggle={() => setUsBasketOpen((value) => !value)}
                    onSelect={setSelectedIso}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t border-rule px-4 py-6 text-sm text-mute">
        <p>
          {t("footerLead")} <XHandleLink />
          {t("footerTail")}{" "}
          <Link className="text-amber hover:text-cream" href={XPRICE_METHODOLOGY_PATH}>
            {t("methodology")}
          </Link>
        </p>
        <p className="mt-2">{t("disclaimer")}</p>
      </footer>
    </div>
  );
}

function Segment<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex border border-rule">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          className={`px-3 py-2 text-sm ${option.value === value ? "bg-amber text-white" : "bg-white text-cream hover:bg-raised"}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function PriceRow({
  row,
  display,
  us,
  onSelect,
  inset = false,
}: {
  row: PricedMarket;
  display: DisplayCurrency;
  us?: PricedMarket;
  onSelect: (iso: string) => void;
  inset?: boolean;
}) {
  const { locale } = useLocale();
  return (
    <tr className="cursor-pointer border-t border-rule hover:bg-raised" onClick={() => onSelect(row.iso2)}>
      <td className={`px-3 py-2 ${inset ? "pl-8" : ""}`}>
        {marketName(row, locale)}
        <span className="ml-2 font-mono text-xs text-mute">{row.iso2}</span>
      </td>
      <td className="px-3 py-2 text-mute">{groupLabel(locale, row.pricingGroup)}</td>
      <td className="px-3 py-2 font-mono">{formatMoney(row.localAmount, row.currency ?? "USD", locale)}</td>
      <td className="px-3 py-2 font-mono text-amber">{formatMoney(row.displayAmount, display, locale)}</td>
      <td className="px-3 py-2 font-mono">{formatMoney(row.equivalentMonthDisplay, display, locale)}</td>
      <td className="px-3 py-2">
        <UsDiscount row={row} us={us} />
      </td>
    </tr>
  );
}

function UsBasketRows({
  rows,
  representative,
  open,
  display,
  us,
  onToggle,
  onSelect,
}: {
  rows: PricedMarket[];
  representative: PricedMarket;
  open: boolean;
  display: DisplayCurrency;
  us?: PricedMarket;
  onToggle: () => void;
  onSelect: (iso: string) => void;
}) {
  const { locale, t } = useLocale();
  return (
    <>
      <tr
        className="cursor-pointer border-t border-rule bg-panel hover:bg-raised"
        aria-expanded={open}
        onClick={onToggle}
      >
        <td className="px-3 py-2">
          <span className="mr-2 inline-block font-mono text-amber">{open ? "▾" : "▸"}</span>
          {t("usSamePrice")}
          <span className="ml-2 font-mono text-xs text-mute">{t("marketCount", { n: rows.length })}</span>
          <span className="ml-2 text-xs text-mute">{open ? t("clickCollapse") : t("clickExpand")}</span>
        </td>
        <td className="px-3 py-2 text-mute">{groupLabel(locale, representative.pricingGroup)}</td>
        <td className="px-3 py-2 font-mono">
          {formatMoney(representative.localAmount, representative.currency ?? "USD", locale)}
        </td>
        <td className="px-3 py-2 font-mono text-amber">{formatMoney(representative.displayAmount, display, locale)}</td>
        <td className="px-3 py-2 font-mono">{formatMoney(representative.equivalentMonthDisplay, display, locale)}</td>
        <td className="px-3 py-2">
          <span className="text-mute">{t("baseline")}</span>
        </td>
      </tr>
      {open
        ? rows.map((row) => (
            <PriceRow key={row.iso2} row={row} display={display} us={us} onSelect={onSelect} inset />
          ))
        : null}
    </>
  );
}

function UsDiscount({ row, us }: { row: PricedMarket; us?: PricedMarket }) {
  const { t } = useLocale();
  const vs = vsUnitedStates(row, us);
  if (vs == null) return <span className="text-mute">—</span>;
  if (row.iso2 === "US" || Math.abs(vs) < 0.0005) {
    return <span className="text-mute">{t("baseline")}</span>;
  }
  return <span className={`font-mono ${vs < 0 ? "text-cheap" : "text-dear"}`}>{formatSignedPct(vs)}</span>;
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="bg-white px-4 py-3">
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">{label}</div>
      <div className="font-display text-xl text-cream">{value}</div>
      <div className="font-mono text-xs text-amber">{detail}</div>
    </div>
  );
}

function Legend() {
  const { t } = useLocale();
  return (
    <div className="flex items-center gap-3 text-xs text-mute">
      <span>{t("cheap")}</span>
      <div className="flex h-2 w-40 overflow-hidden">
        <span className="h-full flex-1 bg-[#2f6f63]" />
        <span className="h-full flex-1 bg-[#7d9a63]" />
        <span className="h-full flex-1 bg-[#cbb892]" />
        <span className="h-full flex-1 bg-[#d9894a]" />
        <span className="h-full flex-1 bg-[#c4471c]" />
      </div>
      <span>{t("dear")}</span>
    </div>
  );
}

function RankColumn({
  cheapest,
  dearest,
  display,
  onSelect,
}: {
  cheapest: PricedMarket[];
  dearest: PricedMarket[];
  display: DisplayCurrency;
  onSelect: (iso: string) => void;
}) {
  const { t } = useLocale();
  return (
    <div className="grid h-full grid-rows-2 bg-panel">
      <RankList title={t("cheapest")} rows={cheapest} display={display} onSelect={onSelect} />
      <RankList title={t("dearest")} rows={dearest} display={display} onSelect={onSelect} />
    </div>
  );
}

function RankList({
  title,
  rows,
  display,
  onSelect,
}: {
  title: string;
  rows: Array<PricedMarket & { samePriceCount?: number }>;
  display: DisplayCurrency;
  onSelect: (iso: string) => void;
}) {
  const { locale } = useLocale();
  return (
    <div className="border-b border-rule px-4 py-3">
      <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">{title}</h2>
      <ol className="space-y-1.5">
        {rows.map((row, index) => (
          <li key={row.iso2}>
            <button type="button" className="flex w-full items-baseline justify-between gap-3 text-left" onClick={() => onSelect(row.iso2)}>
              <span className="text-sm">
                <span className="mr-2 font-mono text-mute">{index + 1}</span>
                {marketName(row, locale)}
              </span>
              <span className="font-mono text-sm text-amber">{formatMoney(row.displayAmount, display, locale)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function formatRateDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}
