// Serves the built site and runs axe on every route, in several themes and both modes.
// Fails on any serious or critical violation.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { serializeSeed } from '@machine-ui/theme-engine';
import { REFERENCE_THEMES } from '@machine-ui/tokens';
import { chromium } from 'playwright';
import { preview } from 'vite';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const ROUTES = ['/', '/get-started', '/themes', '/screens', '/components', '/components/data-table', '/components/prompt-input', '/nope'];
const THEMES = REFERENCE_THEMES.filter((t) => ['graphite', 'folio', 'forge'].includes(t.name));

const server = await preview({ root: fileURLToPath(new URL('..', import.meta.url)), preview: { port: 4174, strictPort: true } });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
let failures = 0;

try {
  for (const seed of THEMES) {
    for (const mode of ['light', 'dark']) {
      for (const route of ROUTES) {
        await page.goto(`http://localhost:4174${route}?theme=${serializeSeed(seed)}&mode=${mode}`);
        await page.waitForTimeout(400);
        await page.addScriptTag({ content: axeSource });
        const violations = await page.evaluate(async () => {
          // @ts-expect-error axe is injected above
          const result = await window.axe.run(document, { resultTypes: ['violations'] });
          return result.violations
            .filter((v: { impact: string }) => v.impact === 'serious' || v.impact === 'critical')
            .map((v: { id: string; nodes: { target: string[] }[] }) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
        });
        if (violations.length) {
          failures += violations.length;
          console.log(`✗ ${seed.name} ${mode} ${route}\n  ${violations.join('\n  ')}`);
        }
      }
    }
  }
} finally {
  await browser.close();
  server.httpServer.close();
}

console.log(failures ? `${failures} accessibility violations` : `axe: no serious or critical violations across ${THEMES.length * 2 * ROUTES.length} pages`);
process.exit(failures ? 1 : 0);
