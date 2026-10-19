import { describe, expect, it } from 'vitest';
import type { ApiReport } from './api-report.ts';
import { checkChangesets, computeBumps, parseChangeset, summarise } from './bump.ts';

const empty: ApiReport = { exports: {} };
const withButton: ApiReport = { exports: { Button: { kind: 'function', signature: '(): JSX.Element' } } };
const tokens = { colorRoles: ['primary'], sharedTokens: [], modeTokens: ['primary'], typePairs: [], presets: {} };

const input = (overrides: Partial<Parameters<typeof computeBumps>[0]> = {}) => ({
  before: { api: { tokens: empty, 'theme-engine': empty, ui: empty }, tokens },
  after: { api: { tokens: empty, 'theme-engine': empty, ui: empty }, tokens },
  changedFiles: [] as string[],
  ...overrides,
});

describe('computeBumps', () => {
  it('reports nothing when nothing changed', () => {
    expect(computeBumps(input())).toEqual([]);
  });

  it('attributes API changes to their package', () => {
    const result = computeBumps(input({ after: { api: { tokens: empty, 'theme-engine': empty, ui: withButton }, tokens } }));
    expect(result).toEqual([{ package: '@machine-ui/ui', level: 'minor', changes: [{ level: 'minor', reason: 'Button: new export' }] }]);
  });

  it('attributes token contract changes to the tokens package', () => {
    const result = computeBumps(input({ after: { api: input().after.api, tokens: { ...tokens, colorRoles: [] } } }));
    expect(result[0]).toMatchObject({ package: '@machine-ui/tokens', level: 'major' });
  });

  it('bumps patch for source changes with no API change, ignoring tests and stories', () => {
    const result = computeBumps(input({ changedFiles: ['packages/ui/src/components/button.tsx', 'packages/ui/src/styles.test.ts', 'apps/site/src/main.tsx'] }));
    expect(result).toEqual([{ package: '@machine-ui/ui', level: 'patch', changes: [{ level: 'patch', reason: 'internal change in 1 file' }] }]);
    expect(computeBumps(input({ changedFiles: ['packages/theme-engine/src/fuzz.test.ts', 'docs/x.md'] }))).toEqual([]);
  });

  it('skips packages that had no report at the base (first release)', () => {
    const result = computeBumps(input({ before: { api: { tokens: empty, 'theme-engine': empty }, tokens }, after: { api: { tokens: empty, 'theme-engine': empty, ui: withButton }, tokens } }));
    expect(result).toEqual([]);
  });
});

describe('summarise', () => {
  it('reads like the spec: level and a count of what drove it', () => {
    expect(
      summarise({
        package: '@machine-ui/ui',
        level: 'minor',
        changes: [
          { level: 'minor', reason: 'Button: new export' },
          { level: 'minor', reason: 'Badge: new export' },
          { level: 'patch', reason: 'internal change in 2 files' },
        ],
      }),
    ).toBe('@machine-ui/ui version: minor (2 new exports)');
  });
});

describe('changesets', () => {
  const minorUi = `---\n"@machine-ui/ui": minor\n'@machine-ui/tokens': patch\n---\n\nAdds Badge.\n`;

  it('parses package levels from frontmatter', () => {
    expect(parseChangeset(minorUi)).toEqual({ '@machine-ui/ui': 'minor', '@machine-ui/tokens': 'patch' });
  });

  it('passes when every bumped package is covered at or above its level', () => {
    const bumps = [{ package: '@machine-ui/ui', level: 'minor' as const, changes: [] }];
    expect(checkChangesets(bumps, [minorUi])).toEqual([]);
  });

  it('fails when a package is missing or under-declared', () => {
    const bumps = [
      { package: '@machine-ui/ui', level: 'major' as const, changes: [] },
      { package: '@machine-ui/theme-engine', level: 'patch' as const, changes: [] },
    ];
    expect(checkChangesets(bumps, [minorUi])).toEqual([
      '@machine-ui/ui needs a major changeset, found minor',
      '@machine-ui/theme-engine needs a patch changeset, found none',
    ]);
  });
});
