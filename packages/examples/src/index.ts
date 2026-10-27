import type { ComponentDoc } from './types.ts';

export * from './types.ts';
export { CodingAgentScreen, DashboardScreen, SCREENS, SettingsScreen, type ScreenDoc } from './screens/index.ts';

const modules = import.meta.glob<{ default: ComponentDoc }>('./components/*.tsx', { eager: true });
const sources = import.meta.glob<string>('./components/*.tsx', { eager: true, query: '?raw', import: 'default' });

/** Every documented component, alphabetical. */
export const COMPONENT_DOCS: ComponentDoc[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.name.localeCompare(b.name));

export function getDoc(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS.find((doc) => doc.slug === slug);
}

/** Source of a component's example module, for the docs code view. */
export function getSource(slug: string): string | undefined {
  return sources[`./components/${slug}.tsx`];
}
export { installCommand, registryItemsFor } from './install.ts';
