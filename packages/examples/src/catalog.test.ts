import { describe, expect, it } from 'vitest';
import * as catalog from './catalog.ts';
import { COMPONENT_DOCS, getSource, SCREENS } from './index.ts';
import { installCommand } from './install.ts';

// The catalog is what the docs site loads first; it must say the same as the full examples.
describe('catalog', () => {
  it('lists every component in the same order, with the same install command', () => {
    expect(catalog.COMPONENTS.map((c) => c.slug)).toEqual(COMPONENT_DOCS.map((d) => d.slug));
    for (const doc of COMPONENT_DOCS) expect(catalog.installCommand(doc.slug), doc.slug).toBe(installCommand(doc.slug));
  });

  it('loads the same examples and source as the eager entry', async () => {
    expect(await catalog.loadDoc('button')).toBe(COMPONENT_DOCS.find((d) => d.slug === 'button'));
    expect(await catalog.loadSource('button')).toBe(getSource('button'));
    expect(catalog.loadDoc('button')).toBe(catalog.loadDoc('button'));
    await expect(catalog.loadDoc('nope')).rejects.toThrow('No examples for "nope"');
  });

  it('lists the same screens', () => {
    expect(catalog.SCREENS.map(({ Component: _, ...meta }) => meta)).toEqual(SCREENS.map(({ Component: _, ...meta }) => meta));
  });
});
