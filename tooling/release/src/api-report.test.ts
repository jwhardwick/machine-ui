import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { apiReport } from './api-report.ts';

const fixture = join(import.meta.dirname, '../fixtures/api-basic');

describe('apiReport', () => {
  const report = apiReport(fixture);

  it('lists every export by its public name, sorted', () => {
    expect(Object.keys(report.exports)).toEqual(['renamedHelper', 'Tone', 'VERSION', 'Widget', 'WidgetProps']);
  });

  it('records kinds and signatures', () => {
    expect(report.exports.Widget).toMatchObject({ kind: 'function', signature: '(props: WidgetProps): string' });
    expect(report.exports.renamedHelper).toMatchObject({ kind: 'function', signature: '(count: number, label?: string): number' });
    expect(report.exports.VERSION).toMatchObject({ kind: 'const', signature: '"1.0.0"' });
    expect(report.exports.Tone).toMatchObject({ kind: 'type', signature: '"calm" | "loud"' });
    expect(report.exports.WidgetProps!.kind).toBe('interface');
  });

  it('expands props and interface members with optionality', () => {
    const members = { label: { type: 'string', optional: false }, size: { type: '"sm" | "md" | undefined', optional: true } };
    expect(report.exports.WidgetProps!.members).toEqual(members);
    expect(report.exports.Widget!.members).toEqual(members);
  });

  it('is deterministic', () => {
    expect(JSON.stringify(apiReport(fixture))).toBe(JSON.stringify(report));
  });
});
