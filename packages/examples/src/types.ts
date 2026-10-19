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

export function defineDoc(doc: ComponentDoc): ComponentDoc {
  return doc;
}
