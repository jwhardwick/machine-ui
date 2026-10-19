// @vitest-environment jsdom
// Server HTML and the first client render must agree. A hydration mismatch makes React re-render
// the whole tree on the client, which in a Next app throws away attributes set before hydration
// (a site's theme on <html>, for one).
import { act, type ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { Sidebar, SidebarInset, SidebarProvider } from './components/sidebar.tsx';
import { StreamingText } from './components/streaming-text.tsx';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let phone = false;
let reduce = false;
window.matchMedia = ((query: string) => ({
  get matches() {
    return (phone && query.includes('max-width')) || (reduce && query === '(prefers-reduced-motion: reduce)');
  },
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
})) as unknown as typeof window.matchMedia;

/** Render on the "server", switch the client's media queries, hydrate, and collect mismatches. */
async function hydrate(ui: ReactNode, client: () => void) {
  const host = document.createElement('div');
  host.innerHTML = renderToString(ui);
  document.body.append(host);
  client();
  const errors: unknown[] = [];
  await act(async () => {
    hydrateRoot(host, ui, { onRecoverableError: (error) => errors.push(error) });
  });
  return { host, errors };
}

afterEach(() => {
  phone = false;
  reduce = false;
  document.body.innerHTML = '';
});

describe('Sidebar hydration', () => {
  const app = (
    <SidebarProvider>
      <Sidebar>
        <a href="/">Home</a>
      </Sidebar>
      <SidebarInset>Page</SidebarInset>
    </SidebarProvider>
  );

  for (const viewport of ['desktop', 'phone'] as const) {
    it(`hydrates server markup without a mismatch on a ${viewport}`, async () => {
      const { host, errors } = await hydrate(app, () => (phone = viewport === 'phone'));
      expect(errors).toEqual([]);
      // After hydration it settles into the right layout for the viewport.
      expect(host.querySelector('[data-slot=sidebar]') !== null).toBe(viewport === 'desktop');
    });
  }
});

describe('StreamingText hydration', () => {
  it('hydrates without a mismatch for reduced-motion visitors, then shows the whole text', async () => {
    const { host, errors } = await hydrate(<StreamingText text="Hello there" />, () => (reduce = true));
    expect(errors).toEqual([]);
    expect(host.textContent).toBe('Hello there');
    expect(host.querySelector('[data-slot=streaming-text]')!.getAttribute('aria-busy')).toBe('false');
  });
});
