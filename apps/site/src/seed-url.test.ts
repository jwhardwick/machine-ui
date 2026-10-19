import { REFERENCE_THEMES, DEFAULT_SEED } from '@machine-ui/tokens';
import { describe, expect, it } from 'vitest';
import { readStateFromSearch, writeStateToUrl } from './seed-url.ts';

describe('seed URL state', () => {
  it('falls back to the default seed and light mode', () => {
    expect(readStateFromSearch('')).toEqual({ seed: DEFAULT_SEED, mode: 'light' });
    expect(readStateFromSearch('?theme=garbage&mode=purple')).toEqual({ seed: DEFAULT_SEED, mode: 'light' });
  });

  it('round-trips a theme and mode through the URL', () => {
    const seed = REFERENCE_THEMES.find((t) => t.name === 'bloom')!;
    const url = writeStateToUrl('https://machine-ui.dev/play?ref=x#top', { seed, mode: 'dark' });
    expect(url).toBe(`https://machine-ui.dev/play?ref=x&theme=ibloom_h350_c75_nw_r85_d80_s85_thumanist_x1200_me&mode=dark#top`);
    expect(readStateFromSearch(new URL(url).search)).toEqual({ seed, mode: 'dark' });
  });
});
