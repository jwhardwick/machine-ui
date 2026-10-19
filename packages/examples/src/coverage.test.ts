import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as ui from '@machine-ui/ui';

const componentsDir = join(import.meta.dirname, 'components');
const screensDir = join(import.meta.dirname, 'screens');
const exampleSources = readdirSync(componentsDir).map((f) => readFileSync(join(componentsDir, f), 'utf8'));
const screenSources = readdirSync(screensDir).map((f) => readFileSync(join(screensDir, f), 'utf8'));

/** Exports that are helpers, providers or primitives re-exported for composition, not things to document on their own. */
const NOT_DOCUMENTED = new Set([
  'cn',
  'Recharts',
  'toast',
  'useSidebar',
  'selectionColumn',
  'navigationMenuTriggerStyle',
  'buttonVariants',
  'badgeVariants',
  'toggleVariants',
]);

/** Portals, overlays, anchors and the tooltip provider are building blocks used inside documented parts. */
const BUILDING_BLOCK = /(?:Portal|Overlay|Anchor)$|^TooltipProvider$/;

const isComponent = (name: string) => /^[A-Z]/.test(name) && !NOT_DOCUMENTED.has(name) && !BUILDING_BLOCK.test(name);

describe('documentation coverage', () => {
  it('every exported component appears in at least one example or screen', () => {
    const used = (name: string) => [...exampleSources, ...screenSources].some((src) => new RegExp(`<${name}[\\s>/]`).test(src));
    const undocumented = Object.keys(ui).filter(isComponent).filter((name) => !used(name));
    expect(undocumented).toEqual([]);
  });
});
