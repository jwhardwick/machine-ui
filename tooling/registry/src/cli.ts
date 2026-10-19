// pnpm registry:build — regenerate the shadcn registry in apps/site/public/r.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildRegistry, OUT_DIR, serialise } from './build.ts';

const files = buildRegistry();
mkdirSync(OUT_DIR, { recursive: true });
for (const file of readdirSync(OUT_DIR)) if (!(file in files)) rmSync(join(OUT_DIR, file));
for (const [file, content] of Object.entries(files)) writeFileSync(join(OUT_DIR, file), serialise(content));
console.log(`wrote ${Object.keys(files).length} registry files to apps/site/public/r`);
