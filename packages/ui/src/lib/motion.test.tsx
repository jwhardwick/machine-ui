// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { useReducedMotion } from './motion.ts';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let listeners: (() => void)[] = [];
let matches = false;
window.matchMedia = ((query: string) => ({
  get matches() {
    return query === '(prefers-reduced-motion: reduce)' && matches;
  },
  media: query,
  addEventListener: (_: string, fn: () => void) => listeners.push(fn),
  removeEventListener: (_: string, fn: () => void) => (listeners = listeners.filter((l) => l !== fn)),
})) as unknown as typeof window.matchMedia;

function Probe() {
  return <span>{useReducedMotion() ? 'reduce' : 'full'}</span>;
}

afterEach(() => {
  matches = false;
  listeners = [];
});

describe('useReducedMotion', () => {
  it('reflects the preference and follows changes', async () => {
    matches = true;
    const host = document.createElement('div');
    const root = createRoot(host);
    await act(async () => root.render(<Probe />));
    expect(host.textContent).toBe('reduce');

    matches = false;
    await act(async () => listeners.forEach((l) => l()));
    expect(host.textContent).toBe('full');
    await act(async () => root.unmount());
    expect(listeners).toHaveLength(0);
  });
});
