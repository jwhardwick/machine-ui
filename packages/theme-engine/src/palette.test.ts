import { NEUTRAL_TEMPERATURES, REFERENCE_THEMES, DEFAULT_SEED, COLOR_ROLES } from '@machine-ui/tokens';
import { displayable } from 'culori';
import { describe, expect, it } from 'vitest';
import { auditPalette, CONTRAST_PAIRS } from './contrast-pairs.ts';
import { buildPalette, type Mode } from './palette.ts';

const MODES: Mode[] = ['light', 'dark'];

function failures(results: ReturnType<typeof auditPalette>) {
  return results.filter((r) => !r.pass).map((r) => `${r.fg} on ${r.bg}: ${r.ratio.toFixed(2)} < ${r.target}`);
}

describe('CONTRAST_PAIRS', () => {
  it('holds text pairs to 4.5:1 and UI boundaries to 3:1', () => {
    for (const pair of CONTRAST_PAIRS) expect(pair.target).toBe(pair.kind === 'text' ? 4.5 : 3);
    expect(CONTRAST_PAIRS).toContainEqual({ fg: 'foreground', bg: 'background', target: 4.5, kind: 'text' });
    expect(CONTRAST_PAIRS).toContainEqual({ fg: 'input', bg: 'background', target: 3, kind: 'ui' });
  });

  it('covers plain foreground text on every surface components put it on', () => {
    for (const bg of ['background', 'card', 'muted'] as const) {
      expect(CONTRAST_PAIRS).toContainEqual({ fg: 'foreground', bg, target: 4.5, kind: 'text' });
    }
  });
});

describe('buildPalette', () => {
  for (const seed of REFERENCE_THEMES) {
    for (const mode of MODES) {
      it(`${seed.name} (${mode}) passes every contrast pair`, () => {
        expect(failures(auditPalette(buildPalette(seed, mode)))).toEqual([]);
      });
    }
  }

  it('passes every pair across a sweep of extreme seeds', () => {
    const problems: string[] = [];
    for (let hue = 0; hue <= 360; hue += 30) {
      for (const chroma of [0, 0.5, 1]) {
        for (const neutral of NEUTRAL_TEMPERATURES) {
          for (const mode of MODES) {
            const seed = { ...DEFAULT_SEED, hue, chroma, neutral };
            for (const f of failures(auditPalette(buildPalette(seed, mode)))) {
              problems.push(`h${hue} c${chroma} ${neutral} ${mode}: ${f}`);
            }
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('assigns every colour role, all inside sRGB', () => {
    const palette = buildPalette(DEFAULT_SEED, 'light');
    for (const role of COLOR_ROLES) {
      expect(displayable({ mode: 'oklch', ...palette[role] })).toBe(true);
    }
  });

  it('keeps light surfaces near-white for every neutral temperature (no cream)', () => {
    for (const neutral of NEUTRAL_TEMPERATURES) {
      const p = buildPalette({ ...DEFAULT_SEED, neutral }, 'light');
      for (const role of ['background', 'card'] as const) {
        expect(p[role].l).toBeGreaterThanOrEqual(0.98);
        expect(p[role].c).toBeLessThanOrEqual(0.006);
      }
    }
  });

  it('solves status and chart colours', () => {
    for (const fg of ['success', 'warning', 'chart-1', 'chart-3', 'chart-5'] as const) {
      expect(CONTRAST_PAIRS.some((p) => p.fg === fg && p.bg === 'background')).toBe(true);
    }
    expect(CONTRAST_PAIRS).toContainEqual({ fg: 'warning-foreground', bg: 'warning', target: 4.5, kind: 'text' });
    expect(CONTRAST_PAIRS).toContainEqual({ fg: 'sidebar-foreground', bg: 'sidebar', target: 4.5, kind: 'text' });
  });

  it('gives near-neutral seeds an ink primary in both modes', () => {
    const seed = { ...DEFAULT_SEED, chroma: 0.1 };
    expect(buildPalette(seed, 'light').primary.l).toBeLessThan(0.3);
    expect(buildPalette(seed, 'dark').primary.l).toBeGreaterThan(0.85);
  });

  it('keeps vivid warm primaries bright instead of darkening them for text use', () => {
    const amber = buildPalette({ ...DEFAULT_SEED, hue: 60, chroma: 0.95 }, 'light');
    expect(amber.primary.l).toBeGreaterThan(0.6);
    expect(CONTRAST_PAIRS.some((p) => p.fg === 'primary' && p.bg === 'background')).toBe(false);
    expect(CONTRAST_PAIRS).toContainEqual({ fg: 'link', bg: 'background', target: 4.5, kind: 'text' });
  });

  it('makes dark mode darker than light mode', () => {
    expect(buildPalette(DEFAULT_SEED, 'light').background.l).toBeGreaterThan(
      buildPalette(DEFAULT_SEED, 'dark').background.l,
    );
  });

  it('reports advisory APCA alongside WCAG', () => {
    const [first] = auditPalette(buildPalette(DEFAULT_SEED, 'light'));
    expect(Math.abs(first!.apca)).toBeGreaterThan(60);
  });
});
