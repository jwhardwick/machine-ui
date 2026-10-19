import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compareRuns, scoreDirectory } from './score.ts';

const fixtures = join(import.meta.dirname, '../fixtures');

describe('scoreDirectory', () => {
  it('finds nothing in on-system code', async () => {
    const score = await scoreDirectory(join(fixtures, 'on-system'));
    expect(score.total).toBe(0);
    expect(score.files).toEqual([{ file: 'settings.tsx', violations: 0, byKind: {} }]);
  });

  it('counts each kind of off-system styling, in components and stylesheets', async () => {
    const score = await scoreDirectory(join(fixtures, 'off-system'));
    const pricing = score.files.find((f) => f.file === 'pricing.tsx')!;
    expect(pricing.byKind).toMatchObject({ gradient: 1, paletteUtility: expect.any(Number), rawColor: 1, rawPx: 1, fontName: 1, rawStyleNumber: 1 });
    const css = score.files.find((f) => f.file === 'theme.css')!;
    expect(css.byKind).toEqual({ rawColor: 1, rawPx: 1 });
    expect(score.total).toBe(pricing.violations + css.violations);
  });
});

describe('compareRuns', () => {
  it('reports the per-page average with and without skills, and whether the target was met', async () => {
    const baseline = await scoreDirectory(join(fixtures, 'off-system'));
    const withSkills = await scoreDirectory(join(fixtures, 'on-system'));
    const comparison = compareRuns(baseline, withSkills);
    expect(comparison.baselinePerPage).toBeGreaterThan(0);
    expect(comparison.withSkillsPerPage).toBe(0);
    expect(comparison.metTarget).toBe(true);
  });
});
