import type { NeutralTemperature, ThemeSeed } from '@machine-ui/tokens';
import { wcagContrast } from './color/contrast.ts';
import { toGamut, type Oklch } from './color/oklch.ts';
import { generateScale, scaleWithPeakChroma, type Scale } from './color/scale.ts';
import { solveContrast } from './color/solve.ts';
import { CONTRAST_PAIRS, auditPalette, type Palette } from './contrast-pairs.ts';

export type Mode = 'light' | 'dark';
export type { Palette };

const NEUTRALS: Record<NeutralTemperature, (seedHue: number) => { h: number; c: number }> = {
  cool: () => ({ h: 250, c: 0.012 }),
  neutral: (seedHue) => ({ h: seedHue, c: 0.004 }),
  warm: () => ({ h: 70, c: 0.014 }),
};

const DESTRUCTIVE_HUE = 27;
const SUCCESS_HUE = 150;
const WARNING_HUE = 75;
/** Hue offsets for chart series, spread so neighbours stay distinguishable. */
const CHART_OFFSETS = [0, 70, 150, 210, 290] as const;
const MAX_SOLVE_PASSES = 4;

const at = (scale: Scale, step: keyof Scale) => scale[step];
const tone = (h: number, c: number, l: number): Oklch => toGamut({ l, c, h });

/** Below this seed chroma the theme reads as neutral, so primary becomes ink rather than a grey. */
const INK_THRESHOLD = 0.2;

/** The most colourful of the mid steps, so yellows and ambers stay bright instead of turning olive. */
function vividStep(scale: Scale): Oklch {
  return [at(scale, 600), at(scale, 500), at(scale, 400)].reduce((best, c) => (c.c > best.c + 0.005 ? c : best));
}

/** Near-white or near-black, whichever reads better on `bg`. */
function onColor(bg: Oklch): Oklch {
  const light = tone(bg.h, 0.01, 0.99);
  const dark = tone(bg.h, 0.02, 0.16);
  return wcagContrast(light, bg) >= wcagContrast(dark, bg) ? light : dark;
}

function startingPalette(seed: ThemeSeed, mode: Mode): Palette {
  const hue = ((seed.hue % 360) + 360) % 360;
  const neutral = NEUTRALS[seed.neutral](hue);
  const n = scaleWithPeakChroma(neutral.h, neutral.c);
  const p = generateScale(hue, seed.chroma);
  const a = generateScale((hue + 30) % 360, seed.chroma * 0.6);
  const d = generateScale(DESTRUCTIVE_HUE, 0.9);
  const ok = generateScale(SUCCESS_HUE, 0.7);
  const warn = generateScale(WARNING_HUE, 0.9);
  const charts = CHART_OFFSETS.map((offset) => generateScale((hue + offset) % 360, Math.max(seed.chroma, 0.55)));
  const chart = (step: keyof Scale) =>
    Object.fromEntries(charts.map((scale, i) => [`chart-${i + 1}`, at(scale, step)])) as Record<
      'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5',
      Oklch
    >;

  if (mode === 'light') {
    // Near-white surfaces whatever the temperature: warmth lives in the greys, not the page.
    const background = tone(neutral.h, Math.min(neutral.c * 0.35, 0.005), 0.985);
    const card = tone(neutral.h, Math.min(neutral.c * 0.15, 0.003), 0.998);
    const primary = seed.chroma < INK_THRESHOLD ? at(p, 900) : vividStep(p);
    const destructive = at(d, 600);
    const success = at(ok, 600);
    const warning = at(warn, 400);
    return {
      background,
      foreground: at(n, 950),
      card,
      'card-foreground': at(n, 950),
      popover: card,
      'popover-foreground': at(n, 950),
      primary,
      'primary-foreground': onColor(primary),
      link: at(p, 600),
      secondary: at(n, 100),
      'secondary-foreground': at(n, 900),
      muted: at(n, 100),
      'muted-foreground': at(n, 600),
      accent: at(a, 100),
      'accent-foreground': at(a, 900),
      destructive,
      'destructive-foreground': onColor(destructive),
      success,
      'success-foreground': onColor(success),
      warning,
      'warning-foreground': onColor(warning),
      border: at(n, 200),
      input: at(n, 500),
      ring: at(p, 500),
      ...chart(500),
      sidebar: tone(neutral.h, Math.min(neutral.c * 0.6, 0.008), 0.97),
      'sidebar-foreground': at(n, 900),
    };
  }

  const background = tone(neutral.h, neutral.c, 0.17);
  const card = tone(neutral.h, neutral.c, 0.21);
  const primary = seed.chroma < INK_THRESHOLD ? at(p, 100) : at(p, 400);
  const destructive = at(d, 400);
  const success = at(ok, 400);
  const warning = at(warn, 300);
  return {
    background,
    foreground: at(n, 50),
    card,
    'card-foreground': at(n, 50),
    popover: card,
    'popover-foreground': at(n, 50),
    primary,
    'primary-foreground': onColor(primary),
    link: at(p, 300),
    secondary: at(n, 800),
    'secondary-foreground': at(n, 100),
    muted: at(n, 800),
    'muted-foreground': at(n, 400),
    accent: at(a, 800),
    'accent-foreground': at(a, 100),
    destructive,
    'destructive-foreground': onColor(destructive),
    success,
    'success-foreground': onColor(success),
    warning,
    'warning-foreground': onColor(warning),
    border: at(n, 800),
    input: at(n, 600),
    ring: at(p, 400),
    ...chart(400),
    sidebar: tone(neutral.h, neutral.c, 0.14),
    'sidebar-foreground': at(n, 100),
  };
}

/** Expand a seed into semantic colour roles, solving each required pair for contrast. */
export function buildPalette(seed: ThemeSeed, mode: Mode): Palette {
  const palette = startingPalette(seed, mode);

  // Solving one pair can move a colour another pair depends on, so repeat until stable.
  for (let pass = 0; pass < MAX_SOLVE_PASSES; pass++) {
    for (const pair of CONTRAST_PAIRS) {
      const solved = solveContrast(palette[pair.fg], palette[pair.bg], pair.target);
      palette[pair.fg] = solved.fg;
      if (solved.bg !== palette[pair.bg]) {
        palette[pair.bg] = solved.bg;
        if (pair.bg === 'card') palette.popover = solved.bg;
      }
    }
    if (auditPalette(palette).every((r) => r.pass)) break;
  }
  return palette;
}
