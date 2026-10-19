import { wcagContrast } from './contrast.ts';
import { toGamut, type Oklch } from './oklch.ts';

/** Headroom added when solving, so rounding in CSS output can't drop a pair below target. */
const MARGIN = 0.05;
const ITERATIONS = 24;

export class ContrastUnsolvableError extends Error {
  constructor(target: number) {
    super(`No lightness reaches a contrast of ${target}:1`);
    this.name = 'ContrastUnsolvableError';
  }
}

const withL = (color: Oklch, l: number): Oklch => toGamut({ ...color, l });

/**
 * Find the smallest lightness change to `moving` that reaches `target` against `fixed`,
 * heading toward whichever extreme gives more contrast. Returns null if neither extreme can.
 */
function nudge(moving: Oklch, fixed: Oklch, target: number): Oklch | null {
  const goal = target + MARGIN;
  const darkest = withL(moving, 0);
  const lightest = withL(moving, 1);
  const extremeL = wcagContrast(darkest, fixed) >= wcagContrast(lightest, fixed) ? 0 : 1;
  if (wcagContrast(withL(moving, extremeL), fixed) < goal) return null;

  let near = moving.l;
  let far = extremeL;
  for (let i = 0; i < ITERATIONS; i++) {
    const mid = (near + far) / 2;
    if (wcagContrast(withL(moving, mid), fixed) >= goal) far = mid;
    else near = mid;
  }
  return withL(moving, far);
}

/**
 * Adjust lightness until `fg` on `bg` meets `target`. The foreground moves first; the
 * background only moves when no foreground lightness can get there.
 */
export function solveContrast(fg: Oklch, bg: Oklch, target: number): { fg: Oklch; bg: Oklch } {
  if (wcagContrast(fg, bg) >= target) return { fg, bg };

  const solvedFg = nudge(fg, bg, target);
  if (solvedFg) return { fg: solvedFg, bg };

  // Push the foreground to its best extreme, then move the background away from it.
  const extremeFg =
    wcagContrast(withL(fg, 0), bg) >= wcagContrast(withL(fg, 1), bg) ? withL(fg, 0) : withL(fg, 1);
  const solvedBg = nudge(bg, extremeFg, target);
  if (solvedBg) return { fg: extremeFg, bg: solvedBg };

  throw new ContrastUnsolvableError(target);
}
