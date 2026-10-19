import { displayable } from 'culori';
import { describe, expect, it } from 'vitest';
import { apcaContrast, wcagContrast } from './contrast.ts';
import { formatOklch, toGamut, type Oklch } from './oklch.ts';
import { generateScale, SCALE_STEPS } from './scale.ts';
import { solveContrast } from './solve.ts';

const white: Oklch = { l: 1, c: 0, h: 0 };
const black: Oklch = { l: 0, c: 0, h: 0 };
const grey: Oklch = { l: 0.6, c: 0, h: 0 };

const inGamut = (c: Oklch) => displayable({ mode: 'oklch', ...c });

describe('contrast', () => {
  it('measures WCAG contrast of white on black as 21:1', () => {
    expect(wcagContrast(white, black)).toBeCloseTo(21, 2);
    expect(wcagContrast(black, white)).toBeCloseTo(21, 2);
  });

  it('measures APCA Lc of black text on white as about 106', () => {
    expect(apcaContrast(black, white)).toBeGreaterThan(105);
    expect(apcaContrast(black, white)).toBeLessThan(107);
    expect(apcaContrast(white, black)).toBeLessThan(-105);
  });
});

describe('formatOklch', () => {
  it('formats with fixed precision', () => {
    expect(formatOklch({ l: 0.62345, c: 0.14219, h: 28.44 })).toBe('oklch(0.623 0.142 28.4)');
  });
});

describe('toGamut', () => {
  it('reduces chroma into sRGB while keeping lightness and hue', () => {
    const wild: Oklch = { l: 0.9, c: 0.4, h: 260 };
    const clamped = toGamut(wild);
    expect(inGamut(clamped)).toBe(true);
    expect(clamped.l).toBeCloseTo(0.9, 3);
    expect(clamped.h).toBeCloseTo(260, 1);
    expect(clamped.c).toBeLessThan(0.4);
  });
});

describe('generateScale', () => {
  for (const [hue, chroma] of [
    [28, 0.35],
    [95, 1],
    [260, 1],
    [0, 0],
  ] as const) {
    it(`produces 11 in-gamut steps with decreasing lightness (h${hue} c${chroma})`, () => {
      const scale = generateScale(hue, chroma);
      const steps = SCALE_STEPS.map((s) => scale[s]);
      expect(steps).toHaveLength(11);
      for (let i = 1; i < steps.length; i++) {
        expect(steps[i]!.l).toBeLessThan(steps[i - 1]!.l);
      }
      for (const step of steps) expect(inGamut(step)).toBe(true);
    });
  }
});

describe('solveContrast', () => {
  it('pulls identical colours apart until they meet the target', () => {
    const { fg, bg } = solveContrast(grey, grey, 4.5);
    expect(wcagContrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('leaves an already-passing pair untouched', () => {
    const fg: Oklch = { l: 0.2, c: 0.02, h: 30 };
    const { fg: solved, bg } = solveContrast(fg, white, 4.5);
    expect(solved).toEqual(fg);
    expect(bg).toEqual(white);
  });

  it('moves the foreground minimally rather than to an extreme', () => {
    const fg: Oklch = { l: 0.62, c: 0.1, h: 150 };
    const { fg: solved } = solveContrast(fg, white, 4.5);
    expect(wcagContrast(solved, white)).toBeGreaterThanOrEqual(4.5);
    expect(wcagContrast(solved, white)).toBeLessThan(5);
  });

  it('moves the background when no foreground can reach the target', () => {
    const mid: Oklch = { l: 0.62, c: 0, h: 0 };
    const { fg, bg } = solveContrast(mid, mid, 7);
    expect(wcagContrast(fg, bg)).toBeGreaterThanOrEqual(7);
  });
});
