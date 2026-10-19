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
