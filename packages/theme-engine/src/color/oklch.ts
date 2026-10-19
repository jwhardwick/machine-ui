import { clampChroma, converter } from 'culori';

export interface Oklch {
  /** Lightness, 0–1. */
  l: number;
  /** Chroma, 0–~0.37. */
  c: number;
  /** Hue in degrees. */
  h: number;
}

const toRgb = converter('rgb');

/** Reduce chroma until the colour fits sRGB, keeping lightness and hue. */
export function toGamut(color: Oklch): Oklch {
  const l = Math.min(1, Math.max(0, color.l));
  const clamped = clampChroma({ mode: 'oklch', l, c: Math.max(0, color.c), h: color.h }, 'oklch', 'rgb');
  return { l, c: clamped.c ?? 0, h: color.h };
}

export function formatOklch({ l, c, h }: Oklch): string {
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 1)})`;
}

/** sRGB channels, clipped to 0–1. */
export function toSrgb(color: Oklch): [number, number, number] {
  const { r, g, b } = toRgb({ mode: 'oklch', ...color });
  return [clip(r), clip(g), clip(b)];
}

export function round(value: number, places: number): number {
  const f = 10 ** places;
  return Math.round(value * f) / f;
}

function clip(v: number): number {
  return Math.min(1, Math.max(0, v));
}
