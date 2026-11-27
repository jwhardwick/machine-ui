import { COLOR_ROLES, REFERENCE_THEMES } from '@machine-ui/tokens';
import { describe, expect, it } from 'vitest';
import {
  buildVariables,
  COLOR_COLLECTION,
  colorVariableName,
  cssColorToRgba,
  cssLengthToPx,
  INVALID_NAME_CHARS,
  primaryFamily,
  THEME_COLLECTION,
} from './variables.ts';

describe('cssLengthToPx', () => {
  it('converts rem, px and vw', () => {
    expect(cssLengthToPx('0.85rem')).toBe(13.6);
    expect(cssLengthToPx('1px')).toBe(1);
    expect(cssLengthToPx('0px')).toBe(0);
    expect(cssLengthToPx('1vw', 1000)).toBe(10);
  });

  it('evaluates fluid clamp() at the measuring viewport', () => {
    // 0.976rem + 0.109vw at 1280px = 15.616 + 1.3952, inside [16, 17.008].
    expect(cssLengthToPx('clamp(1rem, 0.976rem + 0.109vw, 1.063rem)', 1280)).toBe(17.01);
    expect(cssLengthToPx('clamp(1rem, 0.976rem + 0.109vw, 1.063rem)', 320)).toBe(16);
  });
});

describe('cssColorToRgba', () => {
  it('converts oklch to sRGB, keeping alpha', () => {
    expect(cssColorToRgba('oklch(1 0 0)')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
    expect(cssColorToRgba('oklch(0 0 0 / 0.5)')).toEqual({ r: 0, g: 0, b: 0, a: 0.5 });
  });
});

describe('primaryFamily', () => {
  it('takes the first family and strips quotes', () => {
    expect(primaryFamily('"JetBrains Mono", ui-monospace, monospace')).toBe('JetBrains Mono');
    expect(primaryFamily('Georgia, serif')).toBe('Georgia');
  });
});

describe('buildVariables', () => {
  const doc = buildVariables();
  const theme = doc.collections.find((c) => c.name === THEME_COLLECTION)!;
  const color = doc.collections.find((c) => c.name === COLOR_COLLECTION)!;

  it('has one Theme mode per reference theme and Light/Dark Color modes', () => {
    expect(theme.modes).toEqual(REFERENCE_THEMES.map((t) => t.name));
    expect(color.modes).toEqual(['Light', 'Dark']);
  });

  it('gives every variable a value in every mode of its collection', () => {
    for (const collection of doc.collections) {
      for (const v of collection.variables) expect(Object.keys(v.values).sort(), v.name).toEqual([...collection.modes].sort());
    }
  });

  it('aliases every colour role to an existing Theme variable', () => {
    const names = new Set(theme.variables.map((v) => v.name));
    expect(color.variables).toHaveLength(COLOR_ROLES.length);
    for (const v of color.variables) {
      for (const value of Object.values(v.values)) {
        expect(value.kind).toBe('alias');
        if (value.kind === 'alias') expect(names.has(value.name), value.name).toBe(true);
      }
    }
  });

  it('keeps variable names unique within a collection', () => {
    for (const collection of doc.collections) {
      const names = collection.variables.map((v) => v.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });

  it('uses only names Figma accepts', () => {
    for (const collection of doc.collections) {
      expect(collection.name).not.toMatch(INVALID_NAME_CHARS);
      for (const v of collection.variables) expect(v.name).not.toMatch(INVALID_NAME_CHARS);
    }
    expect(theme.variables.map((v) => v.name)).toContain('space/1_5');
  });

  it('hides raw light/dark colours from pickers', () => {
    for (const v of theme.variables.filter((v) => v.type === 'COLOR')) expect(v.scopes).toEqual([]);
  });

  it('groups foreground and chart roles', () => {
    expect(colorVariableName('primary-foreground')).toBe('primary/foreground');
    expect(colorVariableName('foreground')).toBe('foreground');
    expect(colorVariableName('chart-3')).toBe('chart/3');
  });
});
