// Builds a shadcn registry from packages/ui so any shadcn project can install machine-ui
// components as source: `npx shadcn add @machine-ui/button`. Output: apps/site/public/r/.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateTheme } from '@machine-ui/theme-engine';
import { REFERENCE_THEMES, TYPE_PAIRS, type ThemeSeed } from '@machine-ui/tokens';
import postcss, { type AtRule, type ChildNode, type Rule } from 'postcss';

const ROOT = join(import.meta.dirname, '../../..');
export const UI_DIR = join(ROOT, 'packages/ui/src');
export const OUT_DIR = join(ROOT, 'apps/site/public/r');
const TOKENS_DIR = join(ROOT, 'packages/tokens');
const EXAMPLES_DIR = join(ROOT, 'packages/examples/src/components');

const NS = '@machine-ui';
const ITEM_SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json';
const BASE = `${NS}/machine-ui-base`;

type Json = Record<string, unknown>;
type CssObject = Record<string, Record<string, string> | Record<string, Record<string, string>>>;

const uiPackage = JSON.parse(readFileSync(join(UI_DIR, '../package.json'), 'utf8')) as { dependencies: Record<string, string> };

/** How each relative import in packages/ui maps onto a consumer's shadcn aliases. */
function rewriteRelative(specifier: string): { to: string; dependency: string } {
  if (specifier === '../lib/cn.ts') return { to: '@/lib/utils', dependency: 'utils' };
  if (specifier === '../lib/styles.ts') return { to: '@/lib/machine-ui-styles', dependency: `${NS}/machine-ui-styles` };
  if (specifier === '../lib/motion.ts') return { to: '@/hooks/use-reduced-motion', dependency: `${NS}/use-reduced-motion` };
  const component = /^\.\/([\w-]+)\.tsx$/.exec(specifier)?.[1];
  if (component) return { to: `@/components/ui/${component}`, dependency: `${NS}/${component}` };
  throw new Error(`No registry mapping for import "${specifier}"`);
}

const PEERS = new Set(['react', 'react-dom']);
const packageName = (specifier: string) => (specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0]!);

/** Rewrite a source file's imports and collect what it depends on. */
function transform(source: string) {
  const registryDependencies = new Set<string>();
  const dependencies = new Set<string>();
  const content = source.replace(/(from\s+)(['"])([^'"]+)\2/g, (match, from: string, quote: string, specifier: string) => {
    if (specifier.startsWith('.')) {
      const { to, dependency } = rewriteRelative(specifier);
      registryDependencies.add(dependency);
      return `${from}${quote}${to}${quote}`;
    }
    const name = packageName(specifier);
    if (!PEERS.has(name)) {
      const version = uiPackage.dependencies[name];
      if (!version) throw new Error(`"${name}" is imported but not a dependency of @machine-ui/ui`);
      dependencies.add(`${name}@${version}`);
    }
    return match;
  });
  return { content, registryDependencies: [...registryDependencies].sort(), dependencies: [...dependencies].sort() };
}

const titleCase = (slug: string) => slug.split('-').map((w) => w[0]!.toUpperCase() + w.slice(1)).join(' ');

function describe(slug: string): string {
  try {
    const example = readFileSync(join(EXAMPLES_DIR, `${slug}.tsx`), 'utf8');
    const match = /^\s{2}description:\s*\n?\s*(['"])((?:(?!\1).)+)\1/m.exec(example);
    if (match) return match[2]!;
  } catch {
    // No example module with this slug (part of a multi-part component); fall back below.
  }
  return `The ${titleCase(slug)} component from machine-ui, styled with theme tokens only.`;
}

function componentItem(file: string): Json {
  const name = file.replace(/\.tsx$/, '');
  const { content, registryDependencies, dependencies } = transform(readFileSync(join(UI_DIR, 'components', file), 'utf8'));
  return {
    $schema: ITEM_SCHEMA,
    name,
    type: 'registry:ui',
    title: titleCase(name),
    description: describe(name),
    dependencies,
    registryDependencies: [...new Set([BASE, ...registryDependencies])].sort(),
    files: [{ path: `registry/machine-ui/ui/${file}`, type: 'registry:ui', content }],
  };
}

function libItem(name: string, source: string, type: 'registry:lib' | 'registry:hook', path: string, description: string): Json {
  const { content, registryDependencies, dependencies } = transform(readFileSync(join(UI_DIR, source), 'utf8'));
  return {
    $schema: ITEM_SCHEMA,
    name,
    type,
    title: titleCase(name),
    description,
    dependencies,
    registryDependencies,
    files: [{ path, type, content }],
  };
}

const parseCss = (path: string) => postcss.parse(readFileSync(path, 'utf8'));
const declarations = (node: Rule | AtRule) =>
  Object.fromEntries((node.nodes ?? []).filter((n): n is ChildNode & { prop: string; value: string } => n.type === 'decl').map((d) => [d.prop, d.value]));

/** Tailwind mapping, keyframes and base styles: what every component needs, with no colour values. */
function baseItem(): Json {
  const theme: Record<string, string> = {};
  const css: CssObject = {};
  for (const path of [join(TOKENS_DIR, 'theme.css'), join(UI_DIR, 'styles.css')]) {
    parseCss(path).walkAtRules((rule) => {
      if (rule.name === 'theme' && rule.params === 'inline') {
        for (const [prop, value] of Object.entries(declarations(rule))) theme[prop.replace(/^--/, '')] = value;
      }
      if (rule.name === 'keyframes') {
        css[`@keyframes ${rule.params}`] = Object.fromEntries(
          (rule.nodes ?? []).filter((n): n is Rule => n.type === 'rule').map((frame) => [frame.selector, declarations(frame)]),
        );
      }
    });
  }
  const layer: Record<string, Record<string, string>> = {};
  parseCss(join(TOKENS_DIR, 'base.css')).walkRules((rule) => {
    layer[rule.selectors.join(', ')] = declarations(rule);
  });
  css['@layer base'] = layer;
  css['@media (prefers-reduced-motion: reduce)'] = { ':root': { '--motion-fast': '0ms', '--motion-normal': '0ms', '--motion-slow': '0ms' } };

  return {
    $schema: ITEM_SCHEMA,
    name: 'machine-ui-base',
    type: 'registry:theme',
    title: 'machine-ui base',
    description: 'Maps machine-ui tokens onto Tailwind utilities and adds base styles and animations. Pair it with a theme-* item.',
    cssVars: { theme },
    css,
  };
}

function themeItem(seed: ThemeSeed): Json {
  const tokens = generateTheme(seed);
  return {
    $schema: ITEM_SCHEMA,
    name: `theme-${seed.name}`,
    type: 'registry:theme',
    title: `${titleCase(seed.name)} theme`,
    description: `The ${seed.name} preset (${TYPE_PAIRS[seed.typePair].label}), light and dark, with every colour pair contrast-solved. Load its fonts separately.`,
    registryDependencies: [BASE],
    cssVars: { light: { ...tokens.shared, ...tokens.light }, dark: { ...tokens.dark } },
  };
}

/** Every registry file, keyed by output file name. */
export function buildRegistry(): Record<string, Json> {
  const items: Json[] = [
    baseItem(),
    ...REFERENCE_THEMES.map(themeItem),
    libItem('machine-ui-styles', 'lib/styles.ts', 'registry:lib', 'registry/machine-ui/lib/machine-ui-styles.ts', 'Shared class fragments machine-ui components use for focus, fields, menus and floating surfaces.'),
    libItem('use-reduced-motion', 'lib/motion.ts', 'registry:hook', 'registry/machine-ui/hooks/use-reduced-motion.ts', 'True when the person prefers reduced motion; use it for motion driven from JavaScript.'),
    ...readdirSync(join(UI_DIR, 'components'))
      .filter((f) => f.endsWith('.tsx'))
      .sort()
      .map(componentItem),
  ];
  const index = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'machine-ui',
    homepage: 'https://github.com/machine-ui/machine-ui',
    items: items.map(({ $schema: _schema, files, ...rest }) => ({
      ...rest,
      ...(files ? { files: (files as { path: string; type: string }[]).map(({ path, type }) => ({ path, type })) } : {}),
    })),
  };
  return { 'registry.json': index, ...Object.fromEntries(items.map((item) => [`${item.name}.json`, item])) };
}

export const serialise = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

/** Output files that are missing, different or no longer generated. */
export function staleFiles(): string[] {
  const built = buildRegistry();
  let onDisk: string[];
  try {
    onDisk = readdirSync(OUT_DIR);
  } catch {
    return Object.keys(built);
  }
  const stale = Object.entries(built)
    .filter(([file, content]) => {
      try {
        return readFileSync(join(OUT_DIR, file), 'utf8') !== serialise(content);
      } catch {
        return true;
      }
    })
    .map(([file]) => file);
  return [...stale, ...onDisk.filter((file) => !(file in built))];
}
