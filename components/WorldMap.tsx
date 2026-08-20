"use client";

import {
  geoCentroid,
  geoDistance,
  geoGraticule,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from "d3-geo";
import type { Feature, Geometry } from "geojson";
import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import { useLocale } from "@/components/LocaleProvider";
import { MARKET_BY_ISO, MARKET_BY_NUMERIC } from "@/lib/catalog";
import { heatColor, normalize } from "@/lib/color";
import { marketName } from "@/lib/i18n";

type Props = {
  amounts: Map<string, number>;
  labels: Map<string, string>;
  selectedIso: string | null;
  onSelect: (iso2: string) => void;
};

type GeoCountry = Feature<Geometry> & { id?: string | number };
type Rotation = [number, number, number];
type DragState = { x: number; y: number; rotation: Rotation };

const EMPTY = "#e7e2d8";
const DEFAULT_ROTATION: Rotation = [0, 0, 0];
const DRAG_THRESHOLD = 6;

/** Natural Earth 110m 没有香港等小型政区，用坐标点叠在地球上。 */
const GLOBE_PINS: Array<{ iso2: string; lon: number; lat: number }> = [
  { iso2: "HK", lon: 114.1694, lat: 22.3193 },
];

function isoFromFeatureId(id: string | number | undefined): string | null {
  if (id == null) return null;
  const numeric = String(id).replace(/^0+/, "");
  return MARKET_BY_NUMERIC[numeric]?.iso2 ?? null;
}

function normalizeLongitude(value: number) {
  return ((value + 180) % 360 + 360) % 360 - 180;
}

function approach(current: number, target: number, amount: number) {
  const delta = target - current;
  if (Math.abs(delta) <= amount) return target;
  return current + Math.sign(delta) * amount;
}

export function WorldMap({ amounts, labels, selectedIso, onSelect }: Props) {
  const { locale, t } = useLocale();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 640, height: 420 });
  const [countries, setCountries] = useState<GeoCountry[]>([]);
  const [rotation, setRotation] = useState<Rotation>(DEFAULT_ROTATION);
  const [hover, setHover] = useState<{ iso: string; x: number; y: number } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const rotationRef = useRef<Rotation>(DEFAULT_ROTATION);
  const targetRef = useRef<Rotation | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const draggingRef = useRef(false);
  const didDragRef = useRef(false);
  const hoveringRef = useRef(false);
  const interactingRef = useRef(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      setBox({
        width: Math.max(280, Math.round(rect?.width ?? 640)),
        height: Math.max(240, Math.round(rect?.height ?? 420)),
      });
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
      })
      .catch(() => {
        if (!cancelled) setCountries([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!selectedIso || !countries.length) return;
    const country = countries.find((item) => isoFromFeatureId(item.id) === selectedIso);
    const pin = GLOBE_PINS.find((item) => item.iso2 === selectedIso);
    const center = country ? geoCentroid(country) : pin ? [pin.lon, pin.lat] : null;
    if (!center || !Number.isFinite(center[0]) || !Number.isFinite(center[1])) return;

    const nextLongitude = normalizeLongitude(-center[0]);
    const current = rotationRef.current;
    const target: Rotation = [
      current[0] + normalizeLongitude(nextLongitude - normalizeLongitude(current[0])),
      Math.max(-78, Math.min(78, -center[1])),
      0,
    ];
    targetRef.current = target;

    if (reducedMotion) {
      rotationRef.current = target;
      setRotation(target);
      targetRef.current = null;
    }
  }, [countries, reducedMotion, selectedIso]);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();

    const animate = (now: number) => {
      const elapsed = Math.min(80, now - previous);
      previous = now;
      const current = rotationRef.current;
      const target = targetRef.current;
      let next = current;

      if (!reducedMotion && target && !interactingRef.current) {
        const step = elapsed / 560;
        next = [
          approach(current[0], target[0], Math.max(0.3, Math.abs(target[0] - current[0]) * step)),
          approach(current[1], target[1], Math.max(0.2, Math.abs(target[1] - current[1]) * step)),
          0,
        ];
        if (Math.abs(next[0] - target[0]) < 0.12 && Math.abs(next[1] - target[1]) < 0.12) {
          next = target;
          targetRef.current = null;
        }
      } else if (!reducedMotion && !hoveringRef.current && !interactingRef.current) {
        next = [current[0] - elapsed * 0.0036, current[1], 0];
      }

      if (next !== current) {
        rotationRef.current = next;
        setRotation(next);
      }
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  const { width, height } = box;
  const radius = Math.min(width, height) * 0.42;
  const center: [number, number] = [width / 2, height / 2];
  const values = [...amounts.values()];
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;

  const { path, spherePath, graticulePath, projection } = useMemo(() => {
    const nextProjection = geoOrthographic()
      .translate(center)
      .scale(radius)
      .rotate(rotation)
      .clipAngle(90)
      .precision(0.6);
    const nextPath = geoPath(nextProjection);
    const graticule = geoGraticule().step([15, 15])();
    return {
      path: nextPath,
      spherePath: nextPath({ type: "Sphere" }),
      graticulePath: nextPath(graticule),
      projection: nextProjection,
    };
  }, [center, radius, rotation]);

  function updateHover(iso: string, event: { clientX: number; clientY: number }) {
    if (draggingRef.current) return;
    hoveringRef.current = true;
    moveHover(wrapRef.current, iso, event, setHover);
  }

  function clearHover() {
    hoveringRef.current = false;
    setHover(null);
  }

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      didDragRef.current = false;
      draggingRef.current = false;
      interactingRef.current = true;
      targetRef.current = null;
      dragRef.current = { x: event.clientX, y: event.clientY, rotation: rotationRef.current };
    };

    const onMove = (event: PointerEvent) => {
      const start = dragRef.current;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (!draggingRef.current) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        draggingRef.current = true;
        didDragRef.current = true;
        hoveringRef.current = false;
        setHover(null);
      }
      event.preventDefault();
      const next: Rotation = [
        start.rotation[0] + dx * 0.55,
        Math.max(-78, Math.min(78, start.rotation[1] - dy * 0.28)),
        0,
      ];
      rotationRef.current = next;
      setRotation(next);
    };

    const onUp = () => {
      dragRef.current = null;
      draggingRef.current = false;
      interactingRef.current = false;
    };

    node.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      node.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  function selectCountry(iso: string) {
    if (didDragRef.current) return;
    onSelect(iso);
  }

  return (
    <div ref={wrapRef} className="globe-stage absolute inset-0 overflow-hidden" onPointerLeave={clearHover}>
      <div className="globe-stage__wash" aria-hidden="true" />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="relative z-[1] block h-full w-full touch-none select-none outline-none"
        role="img"
        aria-label={t("mapAria")}
      >
        <defs>
          <radialGradient id="globe-ocean" cx="34%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#dce7ee" />
            <stop offset="55%" stopColor="#b7c9d4" />
            <stop offset="100%" stopColor="#8ea6b4" />
          </radialGradient>
          <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="94%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="globe-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#1c1917" floodOpacity="0.12" />
          </filter>
        </defs>

        {spherePath ? <path d={spherePath} fill="url(#globe-ocean)" filter="url(#globe-shadow)" /> : null}
        {spherePath ? <path d={spherePath} fill="url(#globe-glow)" aria-hidden="true" /> : null}
        {graticulePath ? <path d={graticulePath} className="globe-graticule" aria-hidden="true" /> : null}

        {countries.map((country, index) => {
          const iso = isoFromFeatureId(country.id);
          const amount = iso ? amounts.get(iso) : undefined;
          const fill = amount == null ? EMPTY : heatColor(normalize(amount, min, max));
          const d = path(country as GeoPermissibleObjects);
          if (!d) return null;
          const active = iso === selectedIso;
          const hovered = Boolean(iso && hover?.iso === iso);
          return (
            <path
              key={`${country.id ?? "x"}-${index}`}
              d={d}
              className="map-land"
              fill={fill}
              data-active={active ? "true" : "false"}
              data-hover={hovered ? "true" : "false"}
              tabIndex={iso ? 0 : -1}
              role={iso ? "button" : undefined}
              aria-label={iso ? (MARKET_BY_ISO[iso] ? marketName(MARKET_BY_ISO[iso], locale) : iso) : t("unknownRegion")}
              onMouseEnter={(event) => iso && updateHover(iso, event)}
              onMouseMove={(event) => iso && updateHover(iso, event)}
              onMouseLeave={clearHover}
              onFocus={() => iso && setHover({ iso, x: width / 2 - 70, y: 24 })}
              onBlur={clearHover}
              onKeyDown={(event) => {
                if (iso && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  selectCountry(iso);
                }
              }}
              onClick={() => iso && selectCountry(iso)}
            />
          );
        })}

        {GLOBE_PINS.map((pin) => {
          const point = projection([pin.lon, pin.lat]);
          const globeCenter: [number, number] = [-rotation[0], -rotation[1]];
          if (!point || geoDistance([pin.lon, pin.lat], globeCenter) > Math.PI / 2) return null;
          const [x, y] = point;
          const amount = amounts.get(pin.iso2);
          const fill = amount == null ? EMPTY : heatColor(normalize(amount, min, max));
          const active = pin.iso2 === selectedIso;
          const hovered = hover?.iso === pin.iso2;
          return (
            <g
              key={pin.iso2}
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={MARKET_BY_ISO[pin.iso2] ? marketName(MARKET_BY_ISO[pin.iso2], locale) : pin.iso2}
              onMouseEnter={(event) => updateHover(pin.iso2, event)}
              onMouseMove={(event) => updateHover(pin.iso2, event)}
              onMouseLeave={clearHover}
              onFocus={() => setHover({ iso: pin.iso2, x: width / 2 - 70, y: 24 })}
              onBlur={clearHover}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectCountry(pin.iso2);
                }
              }}
              onClick={() => selectCountry(pin.iso2)}
            >
              <circle cx={x} cy={y} r={active || hovered ? 7 : 5.5} fill={fill} className="globe-pin" />
              <circle cx={x} cy={y} r={active || hovered ? 12 : 9} className="globe-pin-ring" />
            </g>
          );
        })}

        {spherePath ? <path d={spherePath} className="globe-outline" fill="none" aria-hidden="true" /> : null}
      </svg>
      {hover ? (
        <div
          className="pointer-events-none absolute z-10 w-48 border border-rule bg-white px-3 py-2 text-xs text-cream shadow-sm"
          style={{
            left: Math.min(hover.x + 12, width - 204),
            top: Math.min(hover.y + 12, height - 76),
          }}
        >
          <div className="font-mono text-mute">{hover.iso}</div>
          <div className="font-display text-sm text-cream">
            {MARKET_BY_ISO[hover.iso] ? marketName(MARKET_BY_ISO[hover.iso], locale) : hover.iso}
          </div>
          <div className="mt-1 font-mono text-amber">{labels.get(hover.iso) ?? t("noFx")}</div>
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
