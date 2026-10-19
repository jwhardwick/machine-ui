// pnpm release:bump [--base <ref>] [--check-changeset] [--json]
// Computes each package's version bump against the base and, with --check-changeset, fails if the
// pending changesets don't declare at least that level.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import type { ApiReport } from '../api-report.ts';
import { checkChangesets, computeBumps, summarise, type Snapshot } from '../bump.ts';
import { apiFile, generateReports, PACKAGES, ROOT, TOKENS_FILE } from '../reports.ts';
import type { TokenReport } from '../token-report.ts';

const { values } = parseArgs({
  options: { base: { type: 'string' }, 'check-changeset': { type: 'boolean' }, json: { type: 'boolean' } },
});

const git = (...args: string[]) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const refExists = (ref: string) => {
  try {
    git('rev-parse', '--verify', '--quiet', ref);
    return true;
  } catch {
    return false;
  }
};

const base = values.base ?? (refExists('origin/main') ? 'origin/main' : 'main');
const mergeBase = git('merge-base', 'HEAD', base);
const showAtBase = (file: string) => {
  try {
    return JSON.parse(git('show', `${mergeBase}:api/${file}`));
  } catch {
    return undefined;
  }
};

const before: Snapshot = {
  api: Object.fromEntries(PACKAGES.map((pkg) => [pkg, showAtBase(apiFile(pkg)) as ApiReport | undefined]).filter(([, r]) => r)),
  tokens: showAtBase(TOKENS_FILE) as TokenReport | undefined,
};
const fresh = generateReports();
const after: Snapshot = {
  api: Object.fromEntries(PACKAGES.map((pkg) => [pkg, JSON.parse(fresh[apiFile(pkg)]!) as ApiReport])),
  tokens: JSON.parse(fresh[TOKENS_FILE]!) as TokenReport,
};
const changedFiles = [
  ...git('diff', '--name-only', mergeBase).split('\n'),
  ...git('ls-files', '--others', '--exclude-standard').split('\n'),
].filter(Boolean);

const bumps = computeBumps({ before, after, changedFiles });
const changesetDir = join(ROOT, '.changeset');
const changesets = readdirSync(changesetDir)
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .map((f) => readFileSync(join(changesetDir, f), 'utf8'));
const problems = values['check-changeset'] ? checkChangesets(bumps, changesets) : [];

if (values.json) {
  console.log(JSON.stringify({ base, mergeBase, bumps, problems }, null, 2));
} else {
  console.log(`Compared with ${base} (${mergeBase.slice(0, 7)})`);
  if (!bumps.length) console.log('No release needed: no public API, token or shipped-source changes.');
  for (const bump of bumps) {
    console.log(`\n${summarise(bump)}`);
    for (const change of bump.changes.slice(0, 12)) console.log(`  ${change.level.padEnd(5)}  ${change.reason}`);
    if (bump.changes.length > 12) console.log(`  … and ${bump.changes.length - 12} more`);
  }
  for (const problem of problems) console.error(`\n✗ ${problem}`);
}
process.exit(problems.length ? 1 : 0);
