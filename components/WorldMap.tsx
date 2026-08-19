"use client";

import { geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import { MARKET_BY_ISO, MARKET_BY_NUMERIC } from "@/lib/catalog";
import { heatColor, normalize } from "@/lib/color";

type Props = {
  amounts: Map<string, number>;
  labels: Map<string, string>;
  selectedIso: string | null;
  onSelect: (iso2: string) => void;
};

type GeoCountry = {
  type: "Feature";
  id?: string | number;
  geometry: GeoPermissibleObjects;
};

const EMPTY = "#e7e2d8";

function isoFromFeatureId(id: string | number | undefined): string | null {
  if (id == null) return null;
  const numeric = String(id).replace(/^0+/, "");
  return MARKET_BY_NUMERIC[numeric]?.iso2 ?? null;
}

export function WorldMap({ amounts, labels, selectedIso, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(960);
  const [countries, setCountries] = useState<GeoCountry[]>([]);
  const [hover, setHover] = useState<{ iso: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(Math.max(320, entries[0]?.contentRect.width ?? 960));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/world-110m.json")
      .then((response) => response.json())
      .then((topology) => {
        if (cancelled) return;
        const collection = feature(topology, topology.objects.countries) as unknown as {
          features: GeoCountry[];
        };
        setCountries(collection.features.filter((item) => String(item.id) !== "10"));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const height = Math.round(width * 0.48);
  const values = [...amounts.values()];
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;

  const path = useMemo(() => {
    const projection = geoNaturalEarth1().fitExtent(
      [
        [8, 12],
        [width - 8, height - 8],
      ],
      { type: "Sphere" },
    );
    return geoPath(projection);
  }, [width, height]);

  return (
    <div ref={wrapRef} className="relative min-h-[240px] w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block h-auto w-full outline-none"
        role="img"
        aria-label="X Premium 全球标价地图"
      >
        <rect width={width} height={height} fill="#ffffff" />
        {countries.map((country, index) => {
          const iso = isoFromFeatureId(country.id);
          const amount = iso ? amounts.get(iso) : undefined;
          const fill = amount == null ? EMPTY : heatColor(normalize(amount, min, max));
          const d = path(country.geometry);
          if (!d) return null;
          return (
            <path
              key={`${country.id ?? "x"}-${index}`}
              d={d}
              className="map-land cursor-pointer"
              fill={fill}
              data-active={iso === selectedIso ? "true" : "false"}
              data-hover={iso && hover?.iso === iso ? "true" : "false"}
              aria-label={iso ? (MARKET_BY_ISO[iso]?.nameZh ?? iso) : "未知地区"}
              onMouseEnter={(event) => iso && moveHover(wrapRef.current, iso, event, setHover)}
              onMouseMove={(event) => iso && moveHover(wrapRef.current, iso, event, setHover)}
              onMouseLeave={() => setHover(null)}
              onClick={() => iso && onSelect(iso)}
            />
          );
        })}
      </svg>
      {hover ? (
        <div
          className="pointer-events-none absolute z-10 w-44 border border-rule bg-panel px-3 py-2 text-xs"
          style={{
            left: Math.min(hover.x + 12, width - 188),
            top: Math.min(hover.y + 12, height - 72),
          }}
        >
          <div className="font-mono text-mute">{hover.iso}</div>
          <div className="font-display text-sm text-cream">{MARKET_BY_ISO[hover.iso]?.nameZh ?? hover.iso}</div>
          <div className="mt-1 font-mono text-amber">
            {labels.get(hover.iso) ?? "无折算"}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function moveHover(
  node: HTMLDivElement | null,
  iso: string,
  event: { clientX: number; clientY: number },
  setHover: (value: { iso: string; x: number; y: number } | null) => void,
) {
  if (!node) return;
  const rect = node.getBoundingClientRect();
  setHover({ iso, x: event.clientX - rect.left, y: event.clientY - rect.top });
}
