import type { ComponentDef, ComponentsDoc } from '@machine-ui/figma/schema';
import { MEASURE_VIEWPORT } from '@machine-ui/figma/variables';
import { applyTheme } from '@machine-ui/theme-engine';
import { DEFAULT_SEED, TYPE_PAIRS } from '@machine-ui/tokens';
import { expect, test } from 'vitest';
import { page, server } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { combinations, FIGMA_SPECS } from './specs.tsx';
import { buildProbes, renderedRoot, walkRoot } from './walk.ts';
import './styles.css';

const MODE = 'light' as const;

async function loadFonts() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${Object.values(TYPE_PAIRS).map((p) => p.googleFontsQuery).join('&')}&display=block`;
  document.head.appendChild(link);
  await new Promise((resolve, reject) => {
    link.onload = resolve;
    link.onerror = reject;
  });
}

test('extract components for Figma', async () => {
  await page.viewport(MEASURE_VIEWPORT, 900);
  await loadFonts();
  const scope = document.createElement('div');
  scope.className = 'bg-background font-sans text-foreground';
  scope.style.padding = '24px';
  document.body.appendChild(scope);
  const applied = applyTheme(DEFAULT_SEED, { target: scope, mode: MODE });

  // Load every face the theme uses, in the weights components use, before measuring anything.
  const families = ['text', 'display', 'code'].map((f) => getComputedStyle(scope).getPropertyValue(`--typeface-${f}`));
  await Promise.all(families.flatMap((stack) => [400, 500, 600, 700].map((w) => document.fonts.load(`${w} 16px ${stack}`))));
  await document.fonts.ready;

  const probes = buildProbes(scope);
  const components: ComponentDef[] = [];

  for (const spec of FIGMA_SPECS) {
    const variants: ComponentDef['variants'] = [];
    for (const props of combinations(spec)) {
      const host = document.createElement('div');
      if (spec.width) host.style.width = `${spec.width}px`;
      host.style.display = 'flow-root';
      scope.appendChild(host);
      const screen = await render(<>{spec.render(props)}</>, { container: host });
      const root = walkRoot(renderedRoot(host), probes);
      expect(root.children.length + (root.fill ? 1 : 0) + (root.stroke ? 1 : 0), `${spec.key} ${JSON.stringify(props)} drew nothing`).toBeGreaterThan(0);
      root.name = spec.name;
      variants.push({ props, root });
      await screen.unmount();
      host.remove();
    }
    components.push({ key: spec.key, name: spec.name, group: spec.group, variants });
  }

  applied.dispose();
  const doc: ComponentsDoc = { measuredIn: { theme: DEFAULT_SEED.name, mode: MODE }, components };
  await server.commands.writeFile('./figma/out/components.json', `${JSON.stringify(doc, null, 2)}\n`);
});
