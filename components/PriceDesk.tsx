"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CountryPanel } from "@/components/CountryPanel";
import { SiteLogo } from "@/components/SiteLogo";
import { CYCLE_LABEL, formatMoney, formatSignedPct, GROUP_LABEL, TIER_LABEL } from "@/lib/money";
import { priceAll, rankUnique, vsUnitedStates } from "@/lib/ranking";
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
  const [usBasketOpen, setUsBasketOpen] = useState(false);

  const priced = useMemo(
    () => priceAll(catalog.markets, tier, cycle, display, rates),
    [catalog.markets, cycle, display, rates, tier],
  );
  const ranked = useMemo(() => rankUnique(priced), [priced]);
  const tableRows = useMemo(
    () => [...priced].sort((a, b) => a.usdAmount - b.usdAmount || a.nameZh.localeCompare(b.nameZh, "zh")),
    [priced],
  );
  const tableBlocks = useMemo(() => {
    const blocks: Array<{ type: "row"; row: PricedMarket } | { type: "us-basket"; rows: PricedMarket[] }> = [];
    let basket: PricedMarket[] = [];
    const flushBasket = () => {
      if (!basket.length) return;
      const ordered = [...basket].sort((a, b) => {
        if (a.iso2 === "US") return -1;
        if (b.iso2 === "US") return 1;
        return a.nameZh.localeCompare(b.nameZh, "zh");
      });
      blocks.push({ type: "us-basket", rows: ordered });
      basket = [];
    };
    for (const row of tableRows) {
      if (row.pricingGroup === "usd_basket") {
        basket.push(row);
      } else {
        flushBasket();
        blocks.push({ type: "row", row });
      }
    }
    flushBasket();
    return blocks;
  }, [tableRows]);
  const cheapest = ranked[0];
  const dearest = ranked[ranked.length - 1];
  const spread = cheapest && dearest && cheapest.usdAmount > 0 ? dearest.usdAmount / cheapest.usdAmount : null;
  const us = priced.find((row) => row.iso2 === "US");
  const selected = priced.find((row) => row.iso2 === selectedIso) ?? null;

  useEffect(() => {
    if (!selectedIso) return;
    if (priced.some((row) => row.iso2 === selectedIso && row.pricingGroup === "usd_basket")) {
      setUsBasketOpen(true);
    }
  }, [priced, selectedIso]);

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
            <h1 className="mt-1 flex items-center gap-2.5 font-display text-4xl tracking-tight">
              <SiteLogo className="h-9 w-9" />
              XPrice
            </h1>
            <p className="mt-1 max-w-xl text-sm text-mute">
              X Premium 官方各国 Web 标价观测站。本站由{" "}
              <a
                href="https://x.com/jarvis11x"
                target="_blank"
                rel="noreferrer"
                className="text-amber hover:text-cream"
              >
                @jarvis11x
              </a>{" "}
              开发。
            </p>
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
          label="整理日期"
          value={formatRateDate(catalog.generatedAt)}
          detail={`汇率 ${formatRateDate(rates.date)}`}
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
        <div className="mb-4">
          <h2 className="font-display text-2xl">完整标价表</h2>
          <p className="text-sm text-mute">
            列出全部 {tableRows.length} 个有标价的市场。美区同价默认折叠，点击展开。美价折扣按美国 Web 标价折算，负数为更便宜。
          </p>
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
                <th className="px-3 py-2 font-medium">美价折扣</th>
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
          本站数据由{" "}
          <a
            className="text-amber hover:text-cream"
            href="https://x.com/jarvis11x"
            rel="noreferrer"
            target="_blank"
          >
            @jarvis11x
          </a>{" "}
          整理，如有误差，请以官方为准。
        </p>
        <p className="mt-2">
          免责声明：XPrice 与 X Corp. 无关联，仅供浏览参考，不构成购买建议。展示价格为整理后的 Web 标价及公开中间价折算，未含税与支付手续费，可能与收银台实际应付金额不一致。本站不提供换区、虚拟地址、礼品卡或代订服务。
        </p>
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
  return (
    <tr className="cursor-pointer border-t border-rule hover:bg-raised" onClick={() => onSelect(row.iso2)}>
      <td className={`px-3 py-2 ${inset ? "pl-8" : ""}`}>
        {row.nameZh}
        <span className="ml-2 font-mono text-xs text-mute">{row.iso2}</span>
      </td>
      <td className="px-3 py-2 text-mute">{GROUP_LABEL[row.pricingGroup]}</td>
      <td className="px-3 py-2 font-mono">{formatMoney(row.localAmount, row.currency ?? "USD")}</td>
      <td className="px-3 py-2 font-mono text-amber">{formatMoney(row.displayAmount, display)}</td>
      <td className="px-3 py-2 font-mono">{formatMoney(row.equivalentMonthDisplay, display)}</td>
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
  return (
    <>
      <tr
        className="cursor-pointer border-t border-rule bg-panel hover:bg-raised"
        aria-expanded={open}
        onClick={onToggle}
      >
        <td className="px-3 py-2">
          <span className="mr-2 inline-block font-mono text-amber">{open ? "▾" : "▸"}</span>
          美区同价
          <span className="ml-2 font-mono text-xs text-mute">{rows.length} 个市场</span>
          <span className="ml-2 text-xs text-mute">{open ? "点击收起" : "点击展开"}</span>
        </td>
        <td className="px-3 py-2 text-mute">{GROUP_LABEL[representative.pricingGroup]}</td>
        <td className="px-3 py-2 font-mono">{formatMoney(representative.localAmount, representative.currency ?? "USD")}</td>
        <td className="px-3 py-2 font-mono text-amber">{formatMoney(representative.displayAmount, display)}</td>
        <td className="px-3 py-2 font-mono">{formatMoney(representative.equivalentMonthDisplay, display)}</td>
        <td className="px-3 py-2">
          <span className="text-mute">基准</span>
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
  const vs = vsUnitedStates(row, us);
  if (vs == null) return <span className="text-mute">—</span>;
  if (row.iso2 === "US" || Math.abs(vs) < 0.0005) {
    return <span className="text-mute">基准</span>;
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
