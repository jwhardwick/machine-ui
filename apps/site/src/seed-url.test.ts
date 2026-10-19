import { REFERENCE_THEMES, DEFAULT_SEED } from '@machine-ui/tokens';
import { describe, expect, it } from 'vitest';
import { initialState, readStateFromSearch, writeStateToUrl } from './seed-url.ts';

const bloom = REFERENCE_THEMES.find((t) => t.name === 'bloom')!;
const folio = REFERENCE_THEMES.find((t) => t.name === 'folio')!;

describe('seed URL state', () => {
  it('ignores missing or malformed parameters', () => {
    expect(readStateFromSearch('')).toEqual({});
    expect(readStateFromSearch('?theme=garbage&mode=purple')).toEqual({});
  });

  it('round-trips a theme and mode through a share link', () => {
    const url = writeStateToUrl('https://machine-ui.dev/components?ref=x#top', { seed: bloom, mode: 'dark' });
    expect(url).toBe('https://machine-ui.dev/components?ref=x&theme=ibloom_h350_c75_nw_r85_d80_s85_thumanist_x1200_me&mode=dark#top');
    expect(readStateFromSearch(new URL(url).search)).toEqual({ seed: bloom, mode: 'dark' });
  });
});

describe('initialState', () => {
  const stored = new URL(writeStateToUrl('https://x.dev/', { seed: folio, mode: 'light' })).search.slice(1);

  it('prefers a share link over the stored choice', () => {
    const link = new URL(writeStateToUrl('https://x.dev/', { seed: bloom, mode: 'dark' })).search;
    expect(initialState(link, stored, false)).toEqual({ seed: bloom, mode: 'dark' });
  });

  it('falls back to the stored choice, then defaults with the system colour scheme', () => {
    expect(initialState('', stored, true)).toEqual({ seed: folio, mode: 'light' });
    expect(initialState('', null, true)).toEqual({ seed: DEFAULT_SEED, mode: 'dark' });
    expect(initialState('', 'theme=nonsense', false)).toEqual({ seed: DEFAULT_SEED, mode: 'light' });
  });
});
