import {
  COLOR_ROLES,
  DEFAULT_SEED,
  MOTION_LEVELS,
  NEUTRAL_TEMPERATURES,
  SEED_LIMITS,
  TYPE_PAIRS,
  TYPE_STEPS,
  type ModeToken,
  type NumericSeedKey,
  type SharedToken,
  type ThemeSeed,
  type ThemeTokens,
  type TokenMap,
} from '@machine-ui/tokens';
import { formatOklch } from './color/oklch.ts';
import { motion } from './motion.ts';
import { buildPalette, type Mode } from './palette.ts';
import { corners, density, elevation, separation } from './shape.ts';
import { fluidTypeScale } from './typography.ts';

function modeTokens(seed: ThemeSeed, mode: Mode): TokenMap<ModeToken> {
  const palette = buildPalette(seed, mode);
  const colors = Object.fromEntries(COLOR_ROLES.map((role) => [role, formatOklch(palette[role])]));
  return { ...colors, ...elevation(seed, mode) } as TokenMap<ModeToken>;
}

/** Expand a seed into the full light and dark token set. */
export function generateTheme(input: ThemeSeed): ThemeTokens {
  const seed = normalizeSeed(input);
  const pair = TYPE_PAIRS[seed.typePair];
  const type = fluidTypeScale(seed.typeRatio);

  const shared = {
    ...corners(seed),
    'typeface-display': pair.display,
    'typeface-text': pair.text,
    'typeface-code': pair.code,
    ...Object.fromEntries(TYPE_STEPS.map((step) => [`type-${step}`, type[step]])),
    ...density(seed),
    ...separation(seed),
    ...motion(seed.motion),
  } as TokenMap<SharedToken>;

  return { seed, shared, light: modeTokens(seed, 'light'), dark: modeTokens(seed, 'dark') };
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/** Clamp every field into range and fill gaps from the default seed. Never throws. */
export function normalizeSeed(input: Partial<ThemeSeed>): ThemeSeed {
  const number = (key: NumericSeedKey): number => {
    const value = input[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_SEED[key];
    if (key === 'hue') return ((value % 360) + 360) % 360;
    const [min, max] = SEED_LIMITS[key];
    return Math.min(max, Math.max(min, value));
  };

  return {
    name: typeof input.name === 'string' && input.name.length > 0 ? input.name : 'custom',
    hue: number('hue'),
    chroma: number('chroma'),
    neutral: pick(input.neutral, NEUTRAL_TEMPERATURES, DEFAULT_SEED.neutral),
    radius: number('radius'),
    density: number('density'),
    separation: number('separation'),
    typePair: pick(input.typePair, Object.keys(TYPE_PAIRS) as ThemeSeed['typePair'][], DEFAULT_SEED.typePair),
    typeRatio: number('typeRatio'),
    motion: pick(input.motion, MOTION_LEVELS, DEFAULT_SEED.motion),
  };
}
