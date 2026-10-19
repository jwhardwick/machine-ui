// @vitest-environment jsdom
import { DEFAULT_SEED, REFERENCE_THEMES } from '@machine-ui/tokens';
import { afterEach, describe, expect, it } from 'vitest';
import { applyTheme } from './apply.ts';

const styles = () => document.head.querySelectorAll('style[data-mui-theme]');

afterEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-mode');
});

describe('applyTheme', () => {
  it('writes the theme to :root through a single reused style element', () => {
    applyTheme(DEFAULT_SEED);
    const handle = applyTheme(REFERENCE_THEMES[1]!, { mode: 'dark' });
    expect(styles()).toHaveLength(1);
    expect(styles()[0]!.textContent).toContain(`--primary: ${handle.tokens.light.primary}`);
    expect(document.documentElement.dataset.mode).toBe('dark');
  });

  it('dispose removes the style element and the mode it set', () => {
    const handle = applyTheme(DEFAULT_SEED, { mode: 'dark' });
    handle.dispose();
    expect(styles()).toHaveLength(0);
    expect(document.documentElement.hasAttribute('data-mode')).toBe(false);
  });

  it('scopes themes to elements without bleeding between them', () => {
    const a = document.body.appendChild(document.createElement('div'));
    const b = document.body.appendChild(document.createElement('div'));
    applyTheme(REFERENCE_THEMES[0]!, { target: a, mode: 'light' });
    applyTheme(REFERENCE_THEMES[1]!, { target: b, mode: 'dark' });
    applyTheme(REFERENCE_THEMES[2]!, { target: a, mode: 'light' });

    expect(a.dataset.muiScope).toBeDefined();
    expect(a.dataset.muiScope).not.toBe(b.dataset.muiScope);
    expect(styles()).toHaveLength(2);
    const aCss = document.head.querySelector(`style[data-mui-theme="${a.dataset.muiScope}"]`)!.textContent!;
    expect(aCss).toContain(`[data-mui-scope="${a.dataset.muiScope}"]`);
    expect(aCss).not.toContain(`[data-mui-scope="${b.dataset.muiScope}"]`);
    expect(b.dataset.mode).toBe('dark');
  });
});
