import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  COLOR_ROLES,
  DEFAULT_SEED,
  MODE_TOKENS,
  REFERENCE_THEMES,
  SHARED_TOKENS,
  TYPE_PAIRS,
} from './index.ts';

const themeCss = readFileSync(fileURLToPath(new URL('../theme.css', import.meta.url)), 'utf8');

function block(css: string, opener: string): string {
  const start = css.indexOf(opener);
  if (start === -1) throw new Error(`missing block ${opener}`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  return css.slice(open + 1, close);
}

function declarations(body: string): string[] {
  return body
    .split('\n')
    .map((line) => line.replace(/\/\*.*?\*\//g, '').trim())
    .filter((line) => line.length > 0);
}

describe('theme.css', () => {
  const inline = declarations(block(themeCss, '@theme inline'));
  const resets = declarations(block(themeCss, '@theme {'));

  it('only references variables inside @theme inline', () => {
    expect(inline.length).toBeGreaterThan(0);
    for (const decl of inline) {
      expect(decl).toMatch(/^--[\w-]+:\s*var\(--[\w-]+\);$/);
    }
  });

  it('only resets namespaces inside the plain @theme block', () => {
    for (const decl of resets) {
      expect(decl).toMatch(/^--[\w-]+-\*:\s*initial;$/);
    }
  });

  it('maps every colour role', () => {
    for (const role of COLOR_ROLES) {
      expect(inline).toContain(`--color-${role}: var(--${role});`);
    }
  });

  it('maps every non-colour token into its Tailwind namespace', () => {
    const expected = [
      '--spacing: var(--space-unit);',
      '--font-display: var(--typeface-display);',
      '--font-sans: var(--typeface-text);',
      '--font-mono: var(--typeface-code);',
      '--radius-sm: var(--corner-sm);',
      '--radius-xl: var(--corner-xl);',
      '--shadow-md: var(--elevation-md);',
      '--text-base: var(--type-base);',
      '--text-4xl: var(--type-4xl);',
      '--ease-standard: var(--motion-ease-standard);',
      '--ease-emphasized: var(--motion-ease-emphasized);',
    ];
    for (const decl of expected) expect(inline).toContain(decl);
  });

  it('never maps a variable onto itself', () => {
    for (const decl of inline) {
      const [name, value] = decl.split(':');
      expect(value).not.toContain(`var(${name})`);
    }
  });
});

describe('schema', () => {
  it('mode tokens include every colour role', () => {
    for (const role of COLOR_ROLES) expect(MODE_TOKENS).toContain(role);
  });

  it('shared and mode tokens do not overlap', () => {
    for (const token of SHARED_TOKENS) expect(MODE_TOKENS).not.toContain(token);
  });
});

describe('reference themes', () => {
  it('ships five uniquely named themes and defaults to the first', () => {
    expect(REFERENCE_THEMES).toHaveLength(5);
    expect(new Set(REFERENCE_THEMES.map((t) => t.name)).size).toBe(5);
    expect(DEFAULT_SEED).toBe(REFERENCE_THEMES[0]);
  });

  it('avoids Inter and maximum radius', () => {
    for (const pair of Object.values(TYPE_PAIRS)) {
      for (const stack of [pair.display, pair.text, pair.code]) {
        expect(stack).not.toMatch(/\bInter\b/);
      }
    }
    for (const theme of REFERENCE_THEMES) expect(theme.radius).toBeLessThan(1);
  });

  it('uses every type pair id that exists', () => {
    for (const theme of REFERENCE_THEMES) expect(TYPE_PAIRS[theme.typePair]).toBeDefined();
  });
});

describe('type pairs', () => {
  it('end every stack with a generic family so failed web fonts degrade', () => {
    for (const pair of Object.values(TYPE_PAIRS)) {
      for (const stack of [pair.display, pair.text, pair.code]) {
        expect(stack).toMatch(/, (serif|sans-serif|monospace)$/);
      }
    }
  });
});
