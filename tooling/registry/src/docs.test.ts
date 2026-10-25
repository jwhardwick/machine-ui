import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES, COMPONENT_DOCS, getSource, registryItemsFor } from '@machine-ui/examples';
import { describe, expect, it } from 'vitest';
import { DOC_FILES, renderDocs, staleCatalog, staleComponentData, staleDocs, type DocsInput } from './docs.ts';

const root = join(import.meta.dirname, '../../..');
const input: DocsInput = {
  docs: COMPONENT_DOCS,
  categories: [...CATEGORIES],
  itemsFor: registryItemsFor,
  sourceFor: getSource,
  uiApi: JSON.parse(readFileSync(join(root, 'api/ui.api.json'), 'utf8')),
};
const out = renderDocs(input);

describe('llms.txt', () => {
  const llms = out['llms.txt']!;

  it('follows the llms.txt shape: title, summary, sections of links', () => {
    expect(llms.startsWith('# machine-ui\n\n> ')).toBe(true);
    expect(llms).toContain('## Components');
    expect(llms).toContain('[Install guide](/install.md)');
    expect(llms).toContain('[Full reference](/llms-full.txt)');
  });

  it('lists every component with the items to install', () => {
    for (const doc of COMPONENT_DOCS) expect(llms, doc.slug).toContain(`[${doc.name}](/components/${doc.slug})`);
    expect(llms).toContain('`@machine-ui/button @machine-ui/sonner`');
  });

  it('states the styling rules', () => {
    expect(llms).toMatch(/semantic tokens/);
    expect(llms).toMatch(/no raw colours/i);
  });
});

describe('llms-full.txt', () => {
  const full = out['llms-full.txt']!;

  it('documents props from the API report and shows example source', () => {
    expect(full).toContain('### Button');
    expect(full).toMatch(/- `variant\?`: "link" \| "default"/);
    expect(full).toContain("from '@machine-ui/ui'");
  });
});

describe('install.md', () => {
  it('walks through registry, theme, fonts and components', () => {
    const install = out['install.md']!;
    for (const text of ['"registries"', 'npx shadcn@latest add @machine-ui/theme-console', 'fonts.googleapis.com', '@machine-ui/button']) {
      expect(install).toContain(text);
    }
  });
});

describe('committed docs', () => {
  it('match the source (run `pnpm docs:build`)', async () => {
    expect(await staleDocs(input)).toEqual([]);
    expect(await staleComponentData(input), 'packages/mcp/data/components.json').toBe(false);
    expect(await staleCatalog(input), 'packages/examples/src/catalog.json').toBe(false);
    expect(DOC_FILES).toEqual(['llms.txt', 'llms-full.txt', 'install.md']);
  });
});
