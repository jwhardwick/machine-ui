import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(import.meta.dirname, 'styles.css'), 'utf8');

describe('ui styles.css', () => {
  it('keeps @theme inline free of literal values', () => {
    const start = css.indexOf('@theme inline');
    const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
    const values = body
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => d.slice(d.indexOf(':') + 1).trim());
    expect(values.length).toBeGreaterThan(0);
    for (const value of values) {
      // Allowed: keyframe names, var() references, calc() over var(), timing keywords and step counts.
      const stripped = value
        .replace(/calc\(var\(--[\w-]+\) \* \d+\)/g, '')
        .replace(/var\(--[\w-]+\)/g, '')
        .replace(/\bmui-[\w-]+\b/g, '')
        .replace(/(?:\blinear\b|\binfinite\b|steps\(\d+\))/g, '')
        .trim();
      expect(stripped, value).toBe('');
    }
  });

  it('defines every keyframe it references', () => {
    const referenced = new Set(css.match(/\bmui-[\w-]+/g));
    for (const name of referenced) expect(css, name).toContain(`@keyframes ${name}`);
  });
});
