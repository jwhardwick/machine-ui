import { describe, expect, it } from 'vitest';
import { COMPONENT_DOCS } from './index.ts';
import { installCommand, registryItemsFor } from './install.ts';

describe('registryItemsFor', () => {
  it('maps a docs page to the registry items its examples use', () => {
    expect(registryItemsFor('button')).toEqual(['button']);
    expect(registryItemsFor('toast')).toEqual(['button', 'sonner']);
    expect(registryItemsFor('thinking-steps')).toEqual(['thinking']);
    expect(registryItemsFor('command-palette')).toEqual(['button', 'command', 'kbd']);
  });

  it('finds at least one item for every docs page', () => {
    for (const doc of COMPONENT_DOCS) expect(registryItemsFor(doc.slug).length, doc.slug).toBeGreaterThan(0);
  });

  it('builds the shadcn command', () => {
    expect(installCommand('toast')).toBe('npx shadcn@latest add @machine-ui/button @machine-ui/sonner');
  });
});
