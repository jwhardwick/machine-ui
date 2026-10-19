import { REFERENCE_THEMES, DEFAULT_SEED } from '@machine-ui/tokens';
import { describe, expect, it } from 'vitest';
import { parseSeed, serializeSeed } from './url.ts';

describe('serializeSeed / parseSeed', () => {
  for (const seed of REFERENCE_THEMES) {
    it(`round-trips ${seed.name}`, () => {
      expect(parseSeed(serializeSeed(seed))).toEqual(seed);
    });
  }

  it('is URL-safe', () => {
    const value = serializeSeed({ ...DEFAULT_SEED, name: 'My Theme!' });
    expect(encodeURIComponent(value)).toBe(value);
  });

  it.each([null, undefined, '', 'garbage', '....', 'h.c.n'])('returns null for %j', (input) => {
    expect(parseSeed(input)).toBeNull();
  });

  it('returns null for unknown enum values', () => {
    expect(parseSeed('h10.tcomic-sans')).toBeNull();
    expect(parseSeed('h10.nx')).toBeNull();
    expect(parseSeed('h10.mz')).toBeNull();
  });

  it('clamps out-of-range numbers and fills missing keys from the default', () => {
    const seed = parseSeed('h9999.c500');
    expect(seed).not.toBeNull();
    expect(seed!.hue).toBe(9999 % 360);
    expect(seed!.chroma).toBe(1);
    expect(seed!.typePair).toBe(DEFAULT_SEED.typePair);
  });
});
