import {
  MOTION_LEVELS,
  NEUTRAL_TEMPERATURES,
  TYPE_PAIR_IDS,
  type MotionLevel,
  type NeutralTemperature,
  type ThemeSeed,
} from '@machine-ui/tokens';
import { normalizeSeed } from './generate.ts';

// Compact seed encoding: `iledger_h28_c35_nw_r15_d70_s10_teditorial_x1250_ms`.
// Only [a-z0-9_-], which is URL-safe and passes Storybook's URL globals validation.
// One letter per field; 0–1 values are stored as percentages, the ratio in thousandths.

const NEUTRAL_CODES: Record<string, NeutralTemperature> = { c: 'cool', n: 'neutral', w: 'warm' };
const MOTION_CODES: Record<string, MotionLevel> = { n: 'none', s: 'subtle', e: 'expressive' };
const PERCENT_FIELDS = { c: 'chroma', r: 'radius', d: 'density', s: 'separation' } as const;

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function serializeSeed(seed: ThemeSeed): string {
  return [
    `i${slug(seed.name) || 'custom'}`,
    `h${Math.round(seed.hue)}`,
    `c${Math.round(seed.chroma * 100)}`,
    `n${seed.neutral[0]}`,
    `r${Math.round(seed.radius * 100)}`,
    `d${Math.round(seed.density * 100)}`,
    `s${Math.round(seed.separation * 100)}`,
    `t${seed.typePair}`,
    `x${Math.round(seed.typeRatio * 1000)}`,
    `m${seed.motion[0]}`,
  ].join('_');
}

/** Decode a share string. Returns null when nothing usable is there or an enum is unknown; never throws. */
export function parseSeed(input: string | null | undefined): ThemeSeed | null {
  if (typeof input !== 'string' || input.length === 0) return null;
  const seed: Partial<ThemeSeed> = {};
  let recognised = 0;

  for (const part of input.split('_')) {
    const code = part[0];
    const value = part.slice(1);
    if (!code || !value) continue;
    const num = Number(value);

    if (code === 'i') {
      seed.name = slug(value) || 'custom';
    } else if (code === 'n') {
      const neutral = NEUTRAL_CODES[value];
      if (!neutral || !NEUTRAL_TEMPERATURES.includes(neutral)) return null;
      seed.neutral = neutral;
    } else if (code === 'h' && Number.isFinite(num)) {
      seed.hue = num;
    } else if (code in PERCENT_FIELDS && Number.isFinite(num)) {
      seed[PERCENT_FIELDS[code as keyof typeof PERCENT_FIELDS]] = num / 100;
    } else if (code === 'x' && Number.isFinite(num)) {
      seed.typeRatio = num / 1000;
    } else if (code === 't') {
      if (!TYPE_PAIR_IDS.includes(value as ThemeSeed['typePair'])) return null;
      seed.typePair = value as ThemeSeed['typePair'];
    } else if (code === 'm') {
      const level = MOTION_CODES[value];
      if (!level || !MOTION_LEVELS.includes(level)) return null;
      seed.motion = level;
    } else {
      continue;
    }
    recognised++;
  }

  return recognised > 0 ? normalizeSeed(seed) : null;
}
