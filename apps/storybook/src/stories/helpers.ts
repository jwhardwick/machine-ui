import { getDoc } from '@machine-ui/examples';

/** Render a named example from the shared registry, so interaction tests exercise exactly what the docs show. */
export function example(slug: string, name: string) {
  const found = getDoc(slug)?.examples.find((e) => e.name === name);
  if (!found) throw new Error(`No example "${name}" for ${slug}`);
  return found.render;
}
