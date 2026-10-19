// Writes packages/tokens/css/themes/<name>.css for every reference theme.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { REFERENCE_THEMES } from '@machine-ui/tokens';
import { referenceThemeCss } from '../src/css.ts';

const outDir = fileURLToPath(new URL('../../tokens/css/themes/', import.meta.url));
for (const seed of REFERENCE_THEMES) {
  writeFileSync(`${outDir}${seed.name}.css`, referenceThemeCss(seed));
  console.log(`wrote ${seed.name}.css`);
}
