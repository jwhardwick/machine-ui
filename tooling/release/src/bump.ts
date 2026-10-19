// Computes each package's version bump from report diffs and changed files, and checks that the
// pending changesets declare at least that level. Pure functions; the CLI supplies git data.
import type { ApiReport } from './api-report.ts';
import { classifyApi, classifyTokens, highest, type Change, type Level } from './classify.ts';
import type { PackageName } from './reports.ts';
import type { TokenReport } from './token-report.ts';

export interface Snapshot {
  /** Missing entries mean the package had no report at that point (not yet released). */
  api: Partial<Record<PackageName, ApiReport>>;
  tokens?: TokenReport;
}

export interface Bump {
  package: string;
  level: Level;
  changes: Change[];
}

const PACKAGE_NAMES: PackageName[] = ['tokens', 'theme-engine', 'ui'];
const NOT_SHIPPED = /\.test\.|\.stories\.|vitest\.config|tsconfig|\/fixtures\//;

export function computeBumps({ before, after, changedFiles }: { before: Snapshot; after: Snapshot; changedFiles: string[] }): Bump[] {
  const bumps: Bump[] = [];
  for (const pkg of PACKAGE_NAMES) {
    const old = before.api[pkg];
    const next = after.api[pkg];
    if (!old || !next) continue;
    const changes = classifyApi(old, next);
    if (pkg === 'tokens' && before.tokens && after.tokens) changes.push(...classifyTokens(before.tokens, after.tokens));
    const shipped = changedFiles.filter((f) => f.startsWith(`packages/${pkg}/`) && !NOT_SHIPPED.test(f));
    if (shipped.length && !changes.length) {
      changes.push({ level: 'patch', reason: `internal change in ${shipped.length} file${shipped.length === 1 ? '' : 's'}` });
    }
    const level = highest(changes);
    if (level !== 'none') bumps.push({ package: `@machine-ui/${pkg}`, level, changes });
  }
  return bumps;
}

/** What kind of change a reason describes, as [singular, plural]. */
function kindOf(reason: string): [string, string] {
  const rules: [RegExp, string, string][] = [
    [/export removed$/, 'removed export', 'removed exports'],
    [/new export$/, 'new export', 'new exports'],
    [/(prop|member) ".*" removed$/, 'removed prop', 'removed props'],
    [/new optional/, 'new optional prop', 'new optional props'],
    [/new required/, 'new required prop', 'new required props'],
    [/is now required$/, 'newly required prop', 'newly required props'],
    [/is now optional$/, 'newly optional prop', 'newly optional props'],
    [/no longer accepts/, 'narrowed type', 'narrowed types'],
    [/accepts/, 'widened type', 'widened types'],
    [/type changed|changed from/, 'changed type', 'changed types'],
    [/^preset ".*" removed$/, 'removed preset', 'removed presets'],
    [/^new preset/, 'new preset', 'new presets'],
    [/^preset ".*" values changed$/, 'changed preset', 'changed presets'],
    [/removed$/, 'removed token', 'removed tokens'],
    [/^new /, 'new token', 'new tokens'],
    [/internal change/, 'internal change', 'internal changes'],
  ];
  for (const [pattern, one, many] of rules) if (pattern.test(reason)) return [one, many];
  return ['change', 'changes'];
}

/** `@machine-ui/ui version: minor (2 new exports)` — the level and what drove it. */
export function summarise(bump: Bump): string {
  const counts = new Map<string, { n: number; forms: [string, string] }>();
  for (const change of bump.changes.filter((c) => c.level === bump.level)) {
    const forms = kindOf(change.reason);
    const entry = counts.get(forms[0]) ?? { n: 0, forms };
    entry.n++;
    counts.set(forms[0], entry);
  }
  const detail = [...counts.values()].map(({ n, forms }) => `${n} ${n === 1 ? forms[0] : forms[1]}`).join(', ');
  return `${bump.package} version: ${bump.level} (${detail})`;
}

const LEVELS: Record<Level | 'none', number> = { none: 0, patch: 1, minor: 2, major: 3 };

/** Package → level from a changeset file's frontmatter. */
export function parseChangeset(source: string): Record<string, Level> {
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? '';
  const entries: Record<string, Level> = {};
  for (const line of frontmatter.split('\n')) {
    const match = /^\s*["']?([^"':]+)["']?\s*:\s*(major|minor|patch)\s*$/.exec(line);
    if (match) entries[match[1]!.trim()] = match[2] as Level;
  }
  return entries;
}

/** Problems with the pending changesets; empty when they cover every computed bump. */
export function checkChangesets(bumps: Bump[], changesets: string[]): string[] {
  const declared: Record<string, Level> = {};
  for (const source of changesets) {
    for (const [pkg, level] of Object.entries(parseChangeset(source))) {
      if (LEVELS[level] > LEVELS[declared[pkg] ?? 'none']) declared[pkg] = level;
    }
  }
  return bumps
    .filter((b) => LEVELS[declared[b.package] ?? 'none'] < LEVELS[b.level])
    .map((b) => `${b.package} needs a ${b.level} changeset, found ${declared[b.package] ?? 'none'}`);
}
