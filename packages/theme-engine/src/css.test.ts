import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { COLOR_ROLES, REFERENCE_THEMES, DEFAULT_SEED } from '@machine-ui/tokens';
import { describe, expect, it } from 'vitest';
import { auditPalette, type Palette } from './contrast-pairs.ts';
import { referenceThemeCss, themeToCss } from './css.ts';
import { generateTheme } from './generate.ts';

const themesDir = fileURLToPath(new URL('../../tokens/css/themes/', import.meta.url));

describe('themeToCss', () => {
  const css = themeToCss(generateTheme(DEFAULT_SEED));

  it('writes light values on :root and dark values behind .dark / data-mode', () => {
    expect(css).toMatch(/^:root \{\n {2}--radius: /);
    expect(css).toContain(':root.dark, :root[data-mode="dark"] {');
    expect(css).toMatch(/--primary: oklch\(/);
  });

  it('collapses motion under prefers-reduced-motion', () => {
    expect(css).toContain(
      '@media (prefers-reduced-motion: reduce) {\n  :root {\n    --motion-fast: 0ms;\n    --motion-normal: 0ms;\n    --motion-slow: 0ms;\n  }\n}',
    );
  });

  it('lets scoped selectors follow an ancestor dark mode unless pinned light', () => {
    const scoped = themeToCss(generateTheme(DEFAULT_SEED), { selector: '[data-mui-scope="3"]' });
    expect(scoped).toContain(':where(.dark, [data-mode="dark"]) [data-mui-scope="3"]:not([data-mode="light"])');
  });
});

describe('generated reference theme CSS', () => {
  it('has one committed file per reference theme', () => {
    const files = readdirSync(themesDir).sort();
    expect(files).toEqual(REFERENCE_THEMES.map((t) => `${t.name}.css`).sort());
  });

  for (const seed of REFERENCE_THEMES) {
    it(`${seed.name}.css matches the engine (run pnpm --filter @machine-ui/theme-engine build:css)`, () => {
      expect(readFileSync(`${themesDir}${seed.name}.css`, 'utf8')).toBe(referenceThemeCss(seed));
    });
  }
});

describe('rounded output', () => {
  const parse = (value: string) => {
    const [l, c, h] = value.slice(6, -1).split(' ').map(Number);
    return { l: l!, c: c!, h: h! };
  };

  for (const seed of REFERENCE_THEMES) {
    it(`${seed.name} still passes every pair after rounding to CSS precision`, () => {
      const tokens = generateTheme(seed);
      for (const mode of ['light', 'dark'] as const) {
        const palette = Object.fromEntries(
          COLOR_ROLES.map((role) => [role, parse(tokens[mode][role])]),
        ) as Palette;
        expect(auditPalette(palette).filter((r) => !r.pass)).toEqual([]);
      }
    });
  }
});
