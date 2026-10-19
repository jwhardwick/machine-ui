// Which shadcn registry items a docs page needs, derived from the examples' imports and the files
// that define each export in packages/ui, so install commands can't drift from the code.
import { getSource } from './index.ts';

const componentSources = import.meta.glob<string>('../../ui/src/components/*.tsx', { eager: true, query: '?raw', import: 'default' });

/** Export name → registry item (the component file it lives in). */
const ITEM_FOR_EXPORT: Map<string, string> = (() => {
  const map = new Map<string, string>([['useReducedMotion', 'use-reduced-motion']]);
  for (const [path, source] of Object.entries(componentSources)) {
    const item = /([\w-]+)\.tsx$/.exec(path)![1]!;
    for (const match of source.matchAll(/^export (?:function|const) (\w+)/gm)) map.set(match[1]!, item);
    for (const match of source.matchAll(/^export \{([^}]+)\};?$/gm)) {
      for (const name of match[1]!.split(',').map((n) => n.trim()).filter((n) => n && !n.startsWith('type '))) map.set(name, item);
    }
  }
  return map;
})();

/** Registry item names a docs page's examples use, sorted. */
export function registryItemsFor(slug: string): string[] {
  const source = getSource(slug) ?? '';
  const items = new Set<string>();
  for (const match of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*'@machine-ui\/ui'/g)) {
    for (const raw of match[1]!.split(',')) {
      const name = raw.trim().replace(/^type\s+/, '');
      const item = ITEM_FOR_EXPORT.get(name);
      if (item) items.add(item);
    }
  }
  return [...items].sort();
}

export function installCommand(slug: string): string {
  return `npx shadcn@latest add ${registryItemsFor(slug).map((item) => `@machine-ui/${item}`).join(' ')}`;
}
