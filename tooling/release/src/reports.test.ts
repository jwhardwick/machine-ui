import { describe, expect, it } from 'vitest';
import { staleReports } from './reports.ts';
import { tokenReport } from './token-report.ts';

describe('committed reports', () => {
  it('match the source (run `pnpm api:report` after changing a public API)', () => {
    expect(staleReports()).toEqual([]);
  });
});

describe('tokenReport', () => {
  it('lists the contract and the presets', () => {
    const report = tokenReport();
    expect(report.colorRoles).toContain('primary');
    expect(report.presets.console).toMatchObject({ hue: 101, typePair: 'technical' });
    expect(Object.keys(report.presets)).toHaveLength(6);
  });
});
