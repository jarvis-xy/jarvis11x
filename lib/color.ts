function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgbToHex(rgb: [number, number, number]): string {
  return `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;
}

const STOPS = ["#2f6f63", "#7d9a63", "#cbb892", "#d9894a", "#c4471c"];

export function heatColor(t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (STOPS.length - 1);
  const index = Math.min(STOPS.length - 2, Math.floor(scaled));
  const local = scaled - index;
  const a = hexToRgb(STOPS[index]);
  const b = hexToRgb(STOPS[index + 1]);
  return rgbToHex([lerp(a[0], b[0], local), lerp(a[1], b[1], local), lerp(a[2], b[2], local)]);
}

export function normalize(value: number, min: number, max: number): number {
  if (max <= min) return 0.5;
  return (value - min) / (max - min);
}
