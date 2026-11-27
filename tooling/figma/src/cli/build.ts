// Bundles the Figma plugin with the token Variables and the extracted components embedded.
// Run `pnpm figma:extract` first for components; without it the plugin only syncs Variables.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import type { ComponentsDoc } from '../schema.ts';
import { buildVariables } from '../variables.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const componentsPath = fileURLToPath(new URL('../../../../apps/storybook/figma/out/components.json', import.meta.url));

const variables = buildVariables();
const components = existsSync(componentsPath) ? (JSON.parse(readFileSync(componentsPath, 'utf8')) as ComponentsDoc) : null;

await build({
  entryPoints: [`${root}plugin/src/code.ts`],
  outfile: `${root}plugin/dist/code.js`,
  bundle: true,
  format: 'iife',
  // Figma's plugin sandbox runs an older JS engine; keep syntax conservative.
  target: 'es2017',
  logLevel: 'warning',
  plugins: [
    {
      name: 'bridge-data',
      setup(b) {
        b.onResolve({ filter: /^virtual:bridge-data$/ }, () => ({ path: 'bridge-data', namespace: 'bridge' }));
        b.onLoad({ filter: /.*/, namespace: 'bridge' }, () => ({ contents: JSON.stringify({ variables, components }), loader: 'json' }));
      },
    },
  ],
});

const variants = components?.components.reduce((n, c) => n + c.variants.length, 0) ?? 0;
const varCount = variables.collections.reduce((n, c) => n + c.variables.length, 0);
console.log(`Built tooling/figma/plugin/dist/code.js: ${varCount} variables, ${variants} component variants.`);
if (!components) console.log('No apps/storybook/figma/out/components.json: run `pnpm figma:extract` to include components.');
console.log('In Figma desktop: Plugins → Development → Import plugin from manifest → tooling/figma/plugin/manifest.json');
