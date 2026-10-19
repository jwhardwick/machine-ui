import { describe, expect, it } from 'vitest';
import type { ApiReport } from './api-report.ts';
import { classifyApi, classifyTokens, highest } from './classify.ts';
import type { TokenReport } from './token-report.ts';

const api = (exports: ApiReport['exports']): ApiReport => ({ exports });
const button = (members: Record<string, { type: string; optional: boolean }>) => ({ kind: 'function' as const, signature: '(props: ButtonProps): JSX.Element', members });
const base = button({ variant: { type: '"default" | "outline" | undefined', optional: true }, label: { type: 'string', optional: false } });

const levels = (changes: { level: string }[]) => changes.map((c) => c.level);

describe('classifyApi', () => {
  it('finds nothing when nothing changed', () => {
    expect(classifyApi(api({ Button: base }), api({ Button: base }))).toEqual([]);
  });

  it('treats a removed export as major and a new one as minor', () => {
    expect(levels(classifyApi(api({ Button: base }), api({})))).toEqual(['major']);
    expect(levels(classifyApi(api({}), api({ Button: base })))).toEqual(['minor']);
  });

  it('treats a removed prop as major', () => {
    const next = button({ label: { type: 'string', optional: false } });
    expect(classifyApi(api({ Button: base }), api({ Button: next }))).toEqual([
      { level: 'major', reason: 'Button: prop "variant" removed' },
    ]);
  });

  it('treats a new optional prop as minor and a new required prop as major', () => {
    const optional = button({ ...base.members, tone: { type: 'string | undefined', optional: true } });
    const required = button({ ...base.members, tone: { type: 'string', optional: false } });
    expect(levels(classifyApi(api({ Button: base }), api({ Button: optional })))).toEqual(['minor']);
    expect(levels(classifyApi(api({ Button: base }), api({ Button: required })))).toEqual(['major']);
  });

  it('treats a widened union as minor and a narrowed one as major', () => {
    const wider = button({ ...base.members, variant: { type: '"default" | "ghost" | "outline" | undefined', optional: true } });
    const narrower = button({ ...base.members, variant: { type: '"default" | undefined', optional: true } });
    expect(classifyApi(api({ Button: base }), api({ Button: wider }))).toEqual([
      { level: 'minor', reason: 'Button: prop "variant" accepts "ghost"' },
    ]);
    expect(classifyApi(api({ Button: base }), api({ Button: narrower }))).toEqual([
      { level: 'major', reason: 'Button: prop "variant" no longer accepts "outline"' },
    ]);
  });

  it('ignores union member order', () => {
    const reordered = button({ ...base.members, variant: { type: 'undefined | "outline" | "default"', optional: true } });
    expect(classifyApi(api({ Button: base }), api({ Button: reordered }))).toEqual([]);
  });

  it('treats optional → required as major and required → optional as minor', () => {
    const required = button({ ...base.members, variant: { type: '"default" | "outline"', optional: false } });
    expect(levels(classifyApi(api({ Button: base }), api({ Button: required })))).toContain('major');
    const relaxed = button({ ...base.members, label: { type: 'string | undefined', optional: true } });
    expect(levels(classifyApi(api({ Button: base }), api({ Button: relaxed })))).toEqual(['minor']);
  });

  it('treats any other type change conservatively as major', () => {
    const changed = button({ ...base.members, label: { type: 'number', optional: false } });
    expect(levels(classifyApi(api({ Button: base }), api({ Button: changed })))).toEqual(['major']);
    expect(levels(classifyApi(api({ VERSION: { kind: 'const', signature: '"1.0.0"' } }), api({ VERSION: { kind: 'function', signature: '(): string' } })))).toEqual(['major']);
  });
});

describe('classifyTokens', () => {
  const tokens: TokenReport = {
    colorRoles: ['background', 'primary'],
    sharedTokens: ['radius'],
    modeTokens: ['background', 'primary'],
    typePairs: ['geist'],
    presets: { graphite: { hue: 255, chroma: 0.12, neutral: 'cool', radius: 0.45, density: 0.45, separation: 0.3, typePair: 'geist', typeRatio: 1.2, motion: 'subtle' } },
  };

  it('treats a removed token as major and an added one as minor', () => {
    expect(classifyTokens(tokens, { ...tokens, colorRoles: ['background'] })).toEqual([{ level: 'major', reason: 'colour role "primary" removed' }]);
    expect(levels(classifyTokens(tokens, { ...tokens, sharedTokens: ['radius', 'corner-xs'] }))).toEqual(['minor']);
  });

  it('treats a changed preset value as patch, a removed preset as major, a new preset as minor', () => {
    const tweaked = { ...tokens, presets: { graphite: { ...tokens.presets.graphite!, hue: 250 } } };
    expect(classifyTokens(tokens, tweaked)).toEqual([{ level: 'patch', reason: 'preset "graphite" values changed' }]);
    expect(levels(classifyTokens(tokens, { ...tokens, presets: {} }))).toEqual(['major']);
    expect(levels(classifyTokens(tokens, { ...tokens, presets: { ...tokens.presets, new: tokens.presets.graphite! } }))).toEqual(['minor']);
  });
});

describe('highest', () => {
  it('picks the largest level, or none', () => {
    expect(highest([{ level: 'patch', reason: '' }, { level: 'minor', reason: '' }])).toBe('minor');
    expect(highest([])).toBe('none');
  });
});
