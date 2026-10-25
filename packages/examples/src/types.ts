import type { ReactNode } from 'react';

export const CATEGORIES = [
  { id: 'forms', label: 'Forms and inputs' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'data', label: 'Data display' },
  { id: 'feedback', label: 'Feedback and status' },
  { id: 'layout', label: 'Layout and utility' },
  { id: 'ai', label: 'AI elements' },
] as const;

export type Category = (typeof CATEGORIES)[number]['id'];

export interface Example {
  name: string;
  render: () => ReactNode;
  /** Wider preview frames for components that need room (tables, sidebars, charts). */
  wide?: boolean;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  category: Category;
  /** One or two plain sentences: what it is and when to use it. */
  description: string;
  examples: Example[];
}

/** A component's docs entry without its examples: enough to list it and show its install command. */
export interface ComponentMeta extends Omit<ComponentDoc, 'examples'> {
  /** Registry items its examples use, prefixed for the shadcn CLI. */
  install: string[];
  /** Whether its first example needs a wide preview frame. */
  wide: boolean;
}

export function defineDoc(doc: ComponentDoc): ComponentDoc {
  return doc;
}
