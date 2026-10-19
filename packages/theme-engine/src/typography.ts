import { TYPE_STEPS, type TypeStep } from '@machine-ui/tokens';
import { round } from './color/oklch.ts';

/** Viewport widths (rem) between which sizes interpolate: 360px → 1280px. */
const MIN_VIEWPORT = 22.5;
const MAX_VIEWPORT = 80;
const MAX_BASE = 1.0625;
/** Readability floors for the small steps. */
const FLOORS: Partial<Record<TypeStep, number>> = { xs: 0.75, sm: 0.875, base: 1 };

/** Fluid `clamp()` sizes for each step of a modular scale. Larger steps compress on small screens. */
export function fluidTypeScale(ratio: number): Record<TypeStep, string> {
  const baseIndex = TYPE_STEPS.indexOf('base');
  const out = {} as Record<TypeStep, string>;
  TYPE_STEPS.forEach((step, i) => {
    const n = i - baseIndex;
    const floor = FLOORS[step] ?? 0;
    const min = Math.max(floor, ratio ** (n > 0 ? n * 0.8 : n));
    const max = Math.max(min, MAX_BASE * ratio ** n);
    const slope = (max - min) / (MAX_VIEWPORT - MIN_VIEWPORT);
    const intercept = min - slope * MIN_VIEWPORT;
    out[step] = `clamp(${round(min, 3)}rem, ${round(intercept, 3)}rem + ${round(slope * 100, 3)}vw, ${round(max, 3)}rem)`;
  });
  return out;
}
