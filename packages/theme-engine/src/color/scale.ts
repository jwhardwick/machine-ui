import { toGamut, type Oklch } from './oklch.ts';

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];
export type Scale = Record<ScaleStep, Oklch>;

/** Perceptually even lightness ladder shared by every hue. */
const LIGHTNESS = [0.97, 0.93, 0.87, 0.78, 0.68, 0.58, 0.49, 0.41, 0.33, 0.25, 0.18] as const;

/** Tonal scale from a seed hue and a 0–1 chroma setting. */
export function generateScale(hue: number, chroma: number): Scale {
  return scaleWithPeakChroma(hue, 0.02 + chroma * 0.2);
}

/** Tonal scale whose middle step has the given absolute OKLCH chroma; ends taper off. */
export function scaleWithPeakChroma(hue: number, peak: number): Scale {
  const scale = {} as Scale;
  SCALE_STEPS.forEach((step, i) => {
    const distance = (i - 5) / 5.5;
    const taper = 0.4 + 0.6 * (1 - distance * distance);
    scale[step] = toGamut({ l: LIGHTNESS[i] as number, c: peak * taper, h: hue });
  });
  return scale;
}
