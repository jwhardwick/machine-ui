import { DEFAULT_SEED, MODE_TOKENS, SHARED_TOKENS, TYPE_PAIRS, TYPE_STEPS } from '@machine-ui/tokens';
import { describe, expect, it } from 'vitest';
import { generateTheme, normalizeSeed } from './generate.ts';
import { fluidTypeScale } from './typography.ts';

const rem = (value: string) => Number.parseFloat(value);

/** [min, max] rem of a `clamp(min, preferred, max)` string. */
function clampBounds(value: string): [number, number] {
  const match = /^clamp\(([\d.]+)rem, .+, ([\d.]+)rem\)$/.exec(value);
  if (!match) throw new Error(`not a clamp(): ${value}`);
  return [Number(match[1]), Number(match[2])];
}

describe('generateTheme', () => {
  const theme = generateTheme(DEFAULT_SEED);

  it('emits every shared and per-mode token', () => {
    expect(Object.keys(theme.shared).sort()).toEqual([...SHARED_TOKENS].sort());
    expect(Object.keys(theme.light).sort()).toEqual([...MODE_TOKENS].sort());
    expect(Object.keys(theme.dark).sort()).toEqual([...MODE_TOKENS].sort());
  });

  it('formats colours as oklch()', () => {
    expect(theme.light.primary).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
  });

  it('uses the seed type pair', () => {
    expect(theme.shared['typeface-display']).toBe(TYPE_PAIRS[DEFAULT_SEED.typePair].display);
  });

  it('gives sharp seeds square corners and soft seeds no pill', () => {
    expect(generateTheme({ ...DEFAULT_SEED, radius: 0 }).shared['corner-md']).toBe('0rem');
    const soft = generateTheme({ ...DEFAULT_SEED, radius: 1 }).shared;
    expect(rem(soft['corner-xl'])).toBeLessThanOrEqual(2);
    expect(soft.radius).toBe(soft['corner-md']);
  });

  it('uses borders, not shadows, at low separation', () => {
    const flat = generateTheme({ ...DEFAULT_SEED, separation: 0 });
    expect(flat.light['elevation-md']).toBe('none');
    expect(flat.shared['card-border-width']).toBe('1px');
    const lifted = generateTheme({ ...DEFAULT_SEED, separation: 1 });
    expect(lifted.light['elevation-md']).not.toBe('none');
    expect(lifted.shared['card-border-width']).toBe('0px');
  });

  it('grows controls and spacing with density', () => {
    const compact = generateTheme({ ...DEFAULT_SEED, density: 0 }).shared;
    const airy = generateTheme({ ...DEFAULT_SEED, density: 1 }).shared;
    expect(rem(airy['space-unit'])).toBeGreaterThan(rem(compact['space-unit']));
    expect(rem(airy['control-md'])).toBeGreaterThan(rem(compact['control-md']));
  });

  it('turns motion off for the none level', () => {
    const still = generateTheme({ ...DEFAULT_SEED, motion: 'none' }).shared;
    expect([still['motion-fast'], still['motion-normal'], still['motion-slow']]).toEqual(['0ms', '0ms', '0ms']);
    const lively = generateTheme({ ...DEFAULT_SEED, motion: 'expressive' }).shared;
    expect(Number.parseInt(lively['motion-slow'])).toBeGreaterThan(
      Number.parseInt(generateTheme({ ...DEFAULT_SEED, motion: 'subtle' }).shared['motion-slow']),
    );
  });
});

describe('fluidTypeScale', () => {
  it('increases monotonically and never shrinks body text below 1rem', () => {
    const scale = fluidTypeScale(1.25);
    const bounds = TYPE_STEPS.map((step) => clampBounds(scale[step]));
    for (let i = 1; i < bounds.length; i++) {
      expect(bounds[i]![0]).toBeGreaterThan(bounds[i - 1]![0]);
      expect(bounds[i]![1]).toBeGreaterThan(bounds[i - 1]![1]);
    }
    expect(clampBounds(scale.base)[0]).toBeGreaterThanOrEqual(1);
  });
});

describe('normalizeSeed', () => {
  it('wraps hue and clamps numbers into range', () => {
    const seed = normalizeSeed({ hue: 400, chroma: -1, radius: 3, typeRatio: 2 });
    expect(seed.hue).toBe(40);
    expect(seed.chroma).toBe(0);
    expect(seed.radius).toBe(1);
    expect(seed.typeRatio).toBe(1.333);
  });

  it('fills missing and invalid fields from the default seed', () => {
    const seed = normalizeSeed({ density: Number.NaN, neutral: 'lukewarm' as never });
    expect(seed.density).toBe(DEFAULT_SEED.density);
    expect(seed.neutral).toBe(DEFAULT_SEED.neutral);
    expect(seed.typePair).toBe(DEFAULT_SEED.typePair);
  });
});
