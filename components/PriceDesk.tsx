"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CountryPanel } from "@/components/CountryPanel";
import { CYCLE_LABEL, formatMoney, GROUP_LABEL, TIER_LABEL } from "@/lib/money";
import { priceAll, rankUnique } from "@/lib/ranking";
import type { Catalog, Cycle, DisplayCurrency, PricedMarket, Rates, Tier } from "@/lib/types";

const WorldMap = dynamic(() => import("@/components/WorldMap").then((mod) => mod.WorldMap), {
  ssr: false,
  loading: () => <div className="flex h-[42vw] min-h-[240px] items-center justify-center text-sm text-mute">正在铺地图</div>,
});

const TIERS: Tier[] = ["basic", "premium", "plus"];
const CYCLES: Cycle[] = ["month", "year"];

type Props = {
  catalog: Catalog;
  rates: Rates;
};

export function PriceDesk({ catalog, rates }: Props) {
  const [tier, setTier] = useState<Tier>("premium");
  const [cycle, setCycle] = useState<Cycle>("month");
  const [display, setDisplay] = useState<DisplayCurrency>("CNY");
  const [query, setQuery] = useState("");
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [localizedOnly, setLocalizedOnly] = useState(true);

  const priced = useMemo(
    () => priceAll(catalog.markets, tier, cycle, display, rates),
    [catalog.markets, cycle, display, rates, tier],
  );
  const ranked = useMemo(() => rankUnique(priced), [priced]);
  const board = useMemo(
    () => (localizedOnly ? ranked.filter((row) => row.pricingGroup === "localized" || row.iso2 === "US") : ranked),
    [localizedOnly, ranked],
  );
  const cheapest = ranked[0];
  const dearest = ranked[ranked.length - 1];
  const spread = cheapest && dearest && cheapest.usdAmount > 0 ? dearest.usdAmount / cheapest.usdAmount : null;
  const us = priced.find((row) => row.iso2 === "US");
  const selected = priced.find((row) => row.iso2 === selectedIso) ?? null;

  const amounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of priced) map.set(row.iso2, row.usdAmount);
    return map;
  }, [priced]);

  const labels = useMemo(() => {
    const map = new Map<string, string>();
    for (const row of priced) {
      map.set(row.iso2, `${formatMoney(row.localAmount, row.currency ?? "USD")} · ${formatMoney(row.displayAmount, display)}`);
    }
    return map;
  }, [display, priced]);

  const hits = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return catalog.markets
      .filter((market) => {
        return (
          market.iso2.toLowerCase().includes(needle) ||
          market.nameEn.toLowerCase().includes(needle) ||
          market.nameZh.toLowerCase().includes(needle)
        );
      })
      .slice(0, 8);
  }, [catalog.markets, query]);

  const ticker = ranked.filter((row) => row.pricingGroup === "localized").slice(0, 24);

  return (
    <div className="min-h-screen bg-white text-cream">
      <header className="border-b border-rule">
        <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">Web list prices · not a checkout</p>
            <h1 className="font-display text-4xl tracking-tight">XPrice</h1>
            <p className="mt-1 max-w-xl text-sm text-mute">X Premium 官方各国 Web 标价观测站。只比价，不换区，也不替你下单。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Segment
              value={tier}
              options={TIERS.map((value) => ({ value, label: TIER_LABEL[value] }))}
              onChange={setTier}
            />
            <Segment
              value={cycle}
              options={CYCLES.map((value) => ({ value, label: CYCLE_LABEL[value] }))}
              onChange={setCycle}
            />
            <Segment
              value={display}
              options={[
                { value: "CNY", label: "人民币" },
                { value: "USD", label: "美元" },
              ]}
              onChange={setDisplay}
            />
          </div>
        </div>
        <div className="relative overflow-hidden border-t border-rule bg-panel py-2">
          <div className="ticker-track flex w-max gap-8 whitespace-nowrap px-4 font-mono text-xs text-amber">
            {[...ticker, ...ticker].map((row, index) => (
              <span key={`${row.iso2}-${index}`}>
                {row.nameZh} {formatMoney(row.displayAmount, display)}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-px border-b border-rule bg-rule md:grid-cols-4">
        <Stat label="标价最低" value={cheapest ? cheapest.nameZh : "—"} detail={cheapest ? formatMoney(cheapest.displayAmount, display) : ""} />
        <Stat label="标价最高" value={dearest ? dearest.nameZh : "—"} detail={dearest ? formatMoney(dearest.displayAmount, display) : ""} />
        <Stat label="高低价差" value={spread ? `${spread.toFixed(1)}×` : "—"} detail="按美元折算" />
        <Stat
          label="官方表日期"
          value={catalog.source.officialUpdatedAt}
          detail={`本站收录 ${formatRateDate(catalog.generatedAt)} · 汇率 ${formatRateDate(rates.date)}`}
        />
      </section>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <div className="flex flex-col gap-3 border-b border-rule px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <label className="sr-only" htmlFor="country-search">
                搜索国家或地区
              </label>
              <input
                id="country-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索国家、地区或代码，例如 日本 / JP"
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
                        <span>{market.nameZh}</span>
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
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">完整标价表</h2>
            <p className="text-sm text-mute">同价篮子默认合并。打开筛选可只看做了本地化定价的市场。</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-cream">
            <input
              type="checkbox"
              checked={localizedOnly}
              onChange={(event) => setLocalizedOnly(event.target.checked)}
            />
            仅本地化标价
          </label>
        </div>
        <div className="overflow-x-auto border border-rule">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-panel font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
              <tr>
                <th className="px-3 py-2 font-medium">市场</th>
                <th className="px-3 py-2 font-medium">分组</th>
                <th className="px-3 py-2 font-medium">本币</th>
                <th className="px-3 py-2 font-medium">{display === "CNY" ? "人民币" : "美元"}</th>
                <th className="px-3 py-2 font-medium">年付等效月费</th>
                <th className="px-3 py-2 font-medium">同价</th>
              </tr>
            </thead>
            <tbody>
              {board.map((row) => (
                <tr
                  key={row.iso2}
                  className="cursor-pointer border-t border-rule hover:bg-raised"
                  onClick={() => setSelectedIso(row.iso2)}
                >
                  <td className="px-3 py-2">
                    {row.nameZh}
                    <span className="ml-2 font-mono text-xs text-mute">{row.iso2}</span>
                  </td>
                  <td className="px-3 py-2 text-mute">{GROUP_LABEL[row.pricingGroup]}</td>
                  <td className="px-3 py-2 font-mono">{formatMoney(row.localAmount, row.currency ?? "USD")}</td>
                  <td className="px-3 py-2 font-mono text-amber">{formatMoney(row.displayAmount, display)}</td>
                  <td className="px-3 py-2 font-mono">{formatMoney(row.equivalentMonthDisplay, display)}</td>
                  <td className="px-3 py-2 text-mute">{row.samePriceCount > 1 ? `${row.samePriceCount} 国` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t border-rule px-4 py-6 text-sm text-mute">
        <p>
          数据来源：
          <a className="text-amber hover:text-cream" href={catalog.source.url} rel="noreferrer" target="_blank">
            {catalog.source.title}
          </a>
          。渠道为 Web 公开标价。官方价目表更新日期 {catalog.source.officialUpdatedAt}，本站收录 {formatRateDate(catalog.generatedAt)}。未含税与支付手续费，可能与收银台不一致。
        </p>
        <p className="mt-2">XPrice 与 X Corp. 无关联。本站不提供换区、虚拟地址、礼品卡或代订服务。</p>
        <p className="mt-2">
          <Link className="text-amber hover:text-cream" href="/methodology">
            方法与口径
          </Link>
        </p>
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
  return (
    <div className="flex items-center gap-3 text-xs text-mute">
      <span>便宜</span>
      <div className="flex h-2 w-40 overflow-hidden">
        <span className="h-full flex-1 bg-[#2f6f63]" />
        <span className="h-full flex-1 bg-[#7d9a63]" />
        <span className="h-full flex-1 bg-[#cbb892]" />
        <span className="h-full flex-1 bg-[#d9894a]" />
        <span className="h-full flex-1 bg-[#c4471c]" />
      </div>
      <span>贵</span>
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
  return (
    <div className="grid h-full grid-rows-2 bg-panel">
      <RankList title="标价最低" rows={cheapest} display={display} onSelect={onSelect} />
      <RankList title="标价最高" rows={dearest} display={display} onSelect={onSelect} />
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
  return (
    <div className="border-b border-rule px-4 py-3">
      <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">{title}</h2>
      <ol className="space-y-1.5">
        {rows.map((row, index) => (
          <li key={row.iso2}>
            <button type="button" className="flex w-full items-baseline justify-between gap-3 text-left" onClick={() => onSelect(row.iso2)}>
              <span className="text-sm">
                <span className="mr-2 font-mono text-mute">{index + 1}</span>
                {row.nameZh}
              </span>
              <span className="font-mono text-sm text-amber">{formatMoney(row.displayAmount, display)}</span>
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
