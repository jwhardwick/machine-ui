import { MOTION_LEVELS, NEUTRAL_TEMPERATURES, SEED_LIMITS, TYPE_PAIR_IDS, type ThemeSeed } from '@machine-ui/tokens';
import { describe, expect, it } from 'vitest';
import { auditPalette } from './contrast-pairs.ts';
import { generateTheme, normalizeSeed } from './generate.ts';
import { buildPalette } from './palette.ts';
import { parseSeed, serializeSeed } from './url.ts';

/** Mulberry32: a small seeded PRNG so failures are reproducible. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomSeed(next: () => number): ThemeSeed {
  const between = ([min, max]: readonly [number, number]) => min + next() * (max - min);
  const pick = <T,>(items: readonly T[]) => items[Math.floor(next() * items.length)]!;
  return {
    name: 'fuzz',
    hue: between(SEED_LIMITS.hue),
    chroma: between(SEED_LIMITS.chroma),
    neutral: pick(NEUTRAL_TEMPERATURES),
    radius: between(SEED_LIMITS.radius),
    density: between(SEED_LIMITS.density),
    separation: between(SEED_LIMITS.separation),
    typePair: pick(TYPE_PAIR_IDS),
    typeRatio: between(SEED_LIMITS.typeRatio),
    motion: pick(MOTION_LEVELS),
  };
}

const next = rng(20261019);
const SEEDS = Array.from({ length: 500 }, () => randomSeed(next));

describe('fuzzed seeds', () => {
  it('pass every contrast pair in both modes', () => {
    const failures = SEEDS.flatMap((seed) =>
      (['light', 'dark'] as const).flatMap((mode) =>
        auditPalette(buildPalette(seed, mode))
          .filter((r) => !r.pass)
          .map((r) => `${serializeSeed(seed)} ${mode}: ${r.fg} on ${r.bg} = ${r.ratio.toFixed(2)}`),
      ),
    );
    expect(failures).toEqual([]);
  });

  it('generate a complete token set with no empty or NaN values', () => {
    for (const seed of SEEDS.slice(0, 100)) {
      const tokens = generateTheme(seed);
      for (const map of [tokens.shared, tokens.light, tokens.dark]) {
        for (const [name, value] of Object.entries(map)) {
          expect(value, `${name} for ${serializeSeed(seed)}`).toMatch(/\S/);
          expect(value, `${name} for ${serializeSeed(seed)}`).not.toMatch(/NaN|undefined|Infinity/);
        }
      }
    }
  });

  it('survive a share-link round trip at link precision', () => {
    for (const seed of SEEDS) {
      const restored = parseSeed(serializeSeed(seed))!;
      expect(serializeSeed(restored)).toBe(serializeSeed(seed));
      expect(restored).toEqual(normalizeSeed(restored));
    }
  });
});
