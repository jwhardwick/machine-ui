import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { CATEGORIES, COMPONENT_DOCS, getSource } from './index.ts';

// React only treats act() as supported when this flag is set.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom gaps that Radix and charting libraries probe for.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.IntersectionObserver ??= class {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
} as unknown as typeof IntersectionObserver;
Element.prototype.scrollIntoView ??= function scrollIntoView() {};
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  onchange: null,
  dispatchEvent: () => false,
})) as typeof window.matchMedia;

const files = readdirSync(join(import.meta.dirname, 'components')).filter((f) => f.endsWith('.tsx'));

describe('component registry', () => {
  it('has one doc per example module, named by slug', () => {
    expect(COMPONENT_DOCS.map((d) => `${d.slug}.tsx`).sort()).toEqual(files.sort());
  });

  it('gives every doc a known category, a description and at least one example', () => {
    const ids = CATEGORIES.map((c) => c.id) as string[];
    for (const doc of COMPONENT_DOCS) {
      expect(ids, doc.slug).toContain(doc.category);
      expect(doc.description.length, doc.slug).toBeGreaterThan(20);
      expect(doc.examples.length, doc.slug).toBeGreaterThan(0);
      expect(new Set(doc.examples.map((e) => e.name)).size, doc.slug).toBe(doc.examples.length);
      expect(getSource(doc.slug), doc.slug).toContain('defineDoc');
    }
  });

  for (const doc of COMPONENT_DOCS) {
    for (const example of doc.examples) {
      it(`renders ${doc.slug} / ${example.name}`, async () => {
        const host = document.body.appendChild(document.createElement('div'));
        const root = createRoot(host);
        await act(async () => root.render(<>{example.render()}</>));
        expect(host.innerHTML.length).toBeGreaterThan(0);
        await act(async () => root.unmount());
        host.remove();
      });
    }
  }
});
