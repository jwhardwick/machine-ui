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
const MAX_SOLVE_PASSES = 4;

const at = (scale: Scale, step: keyof Scale) => scale[step];
const tone = (h: number, c: number, l: number): Oklch => toGamut({ l, c, h });

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

  if (mode === 'light') {
    const background = tone(neutral.h, neutral.c * 0.5, 0.975);
    const card = tone(neutral.h, neutral.c * 0.3, 0.995);
    const primary = at(p, 600);
    const destructive = at(d, 600);
    return {
      background,
      foreground: at(n, 950),
      card,
      'card-foreground': at(n, 950),
      popover: card,
      'popover-foreground': at(n, 950),
      primary,
      'primary-foreground': onColor(primary),
      secondary: at(n, 100),
      'secondary-foreground': at(n, 900),
      muted: at(n, 100),
      'muted-foreground': at(n, 600),
      accent: at(a, 100),
      'accent-foreground': at(a, 900),
      destructive,
      'destructive-foreground': onColor(destructive),
      border: at(n, 200),
      input: at(n, 500),
      ring: at(p, 500),
    };
  }

  const background = tone(neutral.h, neutral.c, 0.17);
  const card = tone(neutral.h, neutral.c, 0.21);
  const primary = at(p, 400);
  const destructive = at(d, 400);
  return {
    background,
    foreground: at(n, 50),
    card,
    'card-foreground': at(n, 50),
    popover: card,
    'popover-foreground': at(n, 50),
    primary,
    'primary-foreground': onColor(primary),
    secondary: at(n, 800),
    'secondary-foreground': at(n, 100),
    muted: at(n, 800),
    'muted-foreground': at(n, 400),
    accent: at(a, 800),
    'accent-foreground': at(a, 100),
    destructive,
    'destructive-foreground': onColor(destructive),
    border: at(n, 800),
    input: at(n, 600),
    ring: at(p, 400),
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
