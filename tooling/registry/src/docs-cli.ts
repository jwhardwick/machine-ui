// pnpm docs:build — regenerate llms.txt, llms-full.txt and install.md in apps/site/public.
// The examples registry uses import.meta.glob and TSX, so it is loaded through Vite.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'vite';
import { CATALOG_FILE, catalogData, COMPONENT_DATA_FILE, componentData, PUBLIC_DIR, renderDocs, type DocsInput } from './docs.ts';

// Root at this package so workspace dependencies resolve regardless of the working directory.
const server = await createServer({ root: join(import.meta.dirname, '..'), configFile: false, appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const examples = (await server.ssrLoadModule('@machine-ui/examples')) as {
    COMPONENT_DOCS: DocsInput['docs'];
    CATEGORIES: DocsInput['categories'];
    registryItemsFor: DocsInput['itemsFor'];
    getSource: DocsInput['sourceFor'];
  };
  const input: DocsInput = {
    docs: examples.COMPONENT_DOCS,
    categories: [...examples.CATEGORIES],
    itemsFor: examples.registryItemsFor,
    sourceFor: examples.getSource,
    uiApi: JSON.parse(readFileSync(join(import.meta.dirname, '../../../api/ui.api.json'), 'utf8')),
  };
  const files = renderDocs(input);
  for (const [file, content] of Object.entries(files)) writeFileSync(join(PUBLIC_DIR, file), content);
  writeFileSync(COMPONENT_DATA_FILE, componentData(input));
  writeFileSync(CATALOG_FILE, catalogData(input));
  console.log(`wrote ${Object.keys(files).join(', ')} to apps/site/public, the MCP component data and the examples catalog`);
} finally {
  await server.close();
}
