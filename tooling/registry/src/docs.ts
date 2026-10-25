// Agent-readable docs generated from source: llms.txt (index), llms-full.txt (props and example
// code) and install.md. Served by the docs site next to the registry, so they can't drift.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ComponentDoc, ComponentMeta } from '@machine-ui/examples';
import { DEFAULT_SEED, REFERENCE_THEMES, TYPE_PAIRS } from '@machine-ui/tokens';

export const DOC_FILES = ['llms.txt', 'llms-full.txt', 'install.md'] as const;
export const PUBLIC_DIR = join(import.meta.dirname, '../../../apps/site/public');

interface ApiMember {
  type: string;
  optional: boolean;
}

export interface DocsInput {
  docs: ComponentDoc[];
  categories: { id: string; label: string }[];
  itemsFor: (slug: string) => string[];
  sourceFor: (slug: string) => string | undefined;
  uiApi: { exports: Record<string, { kind: string; members?: Record<string, ApiMember> }> };
}

const SUMMARY =
  'A theming-first design system on shadcn/ui and Radix. Components install as source through the shadcn CLI. A theme engine generates colour, type, spacing, corners and motion from a few personality settings, and solves every colour pair for WCAG 2.2 contrast in light and dark.';

const RULES = [
  'Build interfaces from these components; do not hand-roll equivalents.',
  'Style with semantic tokens only (`bg-primary`, `text-muted-foreground`, `border-border`, `var(--primary)`): no raw colours, px values, gradients or font names.',
  'Pair every surface with its `-foreground` token; use `text-link` for coloured text. These pairs are contrast-solved.',
  'Use the spacing scale and `h-(--control-sm|md|lg)` for control heights, `rounded-sm|md|lg|xl` for corners.',
  'Keep keyboard access, visible focus and labels: icon-only buttons need `aria-label`.',
  'JavaScript-driven motion (charts, streaming text) must respect `useReducedMotion()`.',
];

const items = (input: DocsInput, slug: string) => input.itemsFor(slug).map((item) => `@machine-ui/${item}`);

/** Component exports an example uses that have documented props. */
function propsFor(input: DocsInput, slug: string): [string, Record<string, ApiMember>][] {
  const source = input.sourceFor(slug) ?? '';
  const names = [...source.matchAll(/import\s*\{([^}]+)\}\s*from\s*'@machine-ui\/ui'/g)].flatMap((m) =>
    m[1]!.split(',').map((n) => n.trim().replace(/^type\s+/, '')),
  );
  return [...new Set(names)]
    .map((name) => [name, input.uiApi.exports[name]] as const)
    .filter((entry): entry is [string, { kind: string; members: Record<string, ApiMember> }] => entry[1]?.kind === 'function' && !!entry[1].members)
    .map(([name, info]) => [name, info.members]);
}

function llmsTxt(input: DocsInput): string {
  const lines = [
    '# machine-ui',
    '',
    `> ${SUMMARY}`,
    '',
    'Add the registry once (see the install guide), then install components with `npx shadcn@latest add <items>`.',
    '',
    '## Docs',
    '',
    '- [Install guide](/install.md): add the registry, a theme, fonts and components',
    '- [Full reference](/llms-full.txt): props and example code for every component',
    '- [Themes](/themes): generate a theme and export CSS, JSON or a theme brief',
    '',
    '## Rules',
    '',
    ...RULES.map((rule) => `- ${rule}`),
    '',
    '## Components',
  ];
  for (const category of input.categories) {
    const docs = input.docs.filter((d) => d.category === category.id);
    if (!docs.length) continue;
    lines.push('', `### ${category.label}`, '');
    for (const doc of docs) lines.push(`- [${doc.name}](/components/${doc.slug}): ${doc.description} Install: \`${items(input, doc.slug).join(' ')}\``);
  }
  lines.push('', '## Themes', '');
  for (const seed of REFERENCE_THEMES) {
    const pair = TYPE_PAIRS[seed.typePair];
    lines.push(`- [${seed.name}](/r/theme-${seed.name}.json): ${pair.label}; ${seed.neutral} greys${seed.name === DEFAULT_SEED.name ? '; the default' : ''}. Install: \`@machine-ui/theme-${seed.name}\``);
  }
  return `${lines.join('\n')}\n`;
}

function llmsFullTxt(input: DocsInput): string {
  const lines = ['# machine-ui: full reference', '', `> ${SUMMARY}`, '', '## Rules', '', ...RULES.map((rule) => `- ${rule}`), ''];
  for (const doc of input.docs) {
    lines.push(`## ${doc.name}`, '', doc.description, '', `Install: \`npx shadcn@latest add ${items(input, doc.slug).join(' ')}\``, '');
    for (const [name, members] of propsFor(input, doc.slug)) {
      lines.push(`### ${name}`, '', ...Object.entries(members).map(([prop, m]) => `- \`${prop}${m.optional ? '?' : ''}\`: ${m.type.replace(/ \| undefined$/, '')}`), '');
    }
    lines.push('Example:', '', '```tsx', (input.sourceFor(doc.slug) ?? '').trim(), '```', '');
  }
  return `${lines.join('\n')}\n`;
}

function installMd(): string {
  const seed = DEFAULT_SEED;
  return `# Install machine-ui

machine-ui installs as source through the [shadcn CLI](https://ui.shadcn.com/docs/cli). You need a React project with Tailwind CSS v4.

The registry lives next to this file: if you are reading \`https://example.com/install.md\`, the registry URL is \`https://example.com/r/{name}.json\`.

## 1. Add the registry

Run \`npx shadcn@latest init\` if the project has no \`components.json\`, then add:

\`\`\`json
"registries": { "@machine-ui": "https://example.com/r/{name}.json" }
\`\`\`

## 2. Install a theme

A theme brings the token mapping, base styles and animations with it. The default is ${seed.name}; see \`/llms.txt\` for the others, or generate one at \`/themes\`.

\`\`\`sh
npx shadcn@latest add @machine-ui/theme-${seed.name}
\`\`\`

Dark mode follows a \`dark\` class on an ancestor (usually \`<html>\`).

## 3. Load the fonts

\`\`\`html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${TYPE_PAIRS[seed.typePair].googleFontsQuery}&display=swap" />
\`\`\`

## 4. Add components

\`\`\`sh
npx shadcn@latest add @machine-ui/button @machine-ui/card @machine-ui/sidebar
\`\`\`

Each component page and \`/llms.txt\` list the exact items. Installed files are yours to edit.

## 5. Verify

Run the project's typecheck, lint and build. Search new code for raw colours (\`#\`, \`rgb(\`), \`px\` values and font names: there should be none.
`;
}

export const COMPONENT_DATA_FILE = join(import.meta.dirname, '../../../packages/mcp/data/components.json');

export interface ComponentData {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  install: string[];
  props: Record<string, Record<string, ApiMember>>;
  example: string;
}

/** The component catalogue as data, for the MCP server (which can't load TSX examples itself). */
export function componentData(input: DocsInput): string {
  const data: ComponentData[] = input.docs.map((doc) => ({
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    categoryLabel: input.categories.find((c) => c.id === doc.category)?.label ?? doc.category,
    description: doc.description,
    install: items(input, doc.slug),
    props: Object.fromEntries(propsFor(input, doc.slug)),
    example: (input.sourceFor(doc.slug) ?? '').trim(),
  }));
  return `${JSON.stringify(data, null, 2)}\n`;
}

export async function staleComponentData(input: DocsInput): Promise<boolean> {
  return (await readFile(COMPONENT_DATA_FILE, 'utf8').catch(() => null)) !== componentData(input);
}

export const CATALOG_FILE = join(import.meta.dirname, '../../../packages/examples/src/catalog.json');

/** Every component without its examples, so the docs site can list them before loading any example code. */
export function catalogData(input: DocsInput): string {
  const data: ComponentMeta[] = input.docs.map((doc) => ({
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    description: doc.description,
    install: items(input, doc.slug),
    wide: Boolean(doc.examples[0]?.wide),
  }));
  return `${JSON.stringify(data, null, 2)}\n`;
}

export async function staleCatalog(input: DocsInput): Promise<boolean> {
  return (await readFile(CATALOG_FILE, 'utf8').catch(() => null)) !== catalogData(input);
}

export function renderDocs(input: DocsInput): Record<(typeof DOC_FILES)[number], string> {
  return { 'llms.txt': llmsTxt(input), 'llms-full.txt': llmsFullTxt(input), 'install.md': installMd() };
}

export async function staleDocs(input: DocsInput): Promise<string[]> {
  const rendered = renderDocs(input);
  const stale: string[] = [];
  for (const file of DOC_FILES) {
    const onDisk = await readFile(join(PUBLIC_DIR, file), 'utf8').catch(() => null);
    if (onDisk !== rendered[file]) stale.push(file);
  }
  return stale;
}
