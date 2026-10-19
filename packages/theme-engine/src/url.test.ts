import { REFERENCE_THEMES, DEFAULT_SEED } from '@machine-ui/tokens';
import { describe, expect, it } from 'vitest';
import { parseSeed, serializeSeed } from './url.ts';

describe('serializeSeed / parseSeed', () => {
  for (const seed of REFERENCE_THEMES) {
    it(`round-trips ${seed.name}`, () => {
      expect(parseSeed(serializeSeed(seed))).toEqual(seed);
    });
  }

  it('uses only characters that survive URLs and Storybook globals', () => {
    const value = serializeSeed({ ...DEFAULT_SEED, name: 'My Theme!' });
    expect(value).toMatch(/^[a-zA-Z0-9_-]+$/);
    expect(parseSeed(value)!.name).toBe('my-theme');
  });

  it.each([null, undefined, '', 'garbage', '____', 'h_c_n'])('returns null for %j', (input) => {
    expect(parseSeed(input)).toBeNull();
  });

  it('returns null for unknown enum values', () => {
    expect(parseSeed('h10_tcomic-sans')).toBeNull();
    expect(parseSeed('h10_nx')).toBeNull();
    expect(parseSeed('h10_mz')).toBeNull();
  });

  it('clamps out-of-range numbers and fills missing keys from the default', () => {
    const seed = parseSeed('h9999_c500');
    expect(seed).not.toBeNull();
    expect(seed!.hue).toBe(9999 % 360);
    expect(seed!.chroma).toBe(1);
    expect(seed!.typePair).toBe(DEFAULT_SEED.typePair);
  });
});
