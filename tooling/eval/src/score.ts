// Scores generated UI code for off-system styling, using the same patterns as the tokens-only
// lint rule. The spec's target: zero per page with the consumer skills.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import machineUi, { CHECKS } from '@machine-ui/eslint-plugin';
import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';

export interface FileScore {
  file: string;
  violations: number;
  byKind: Record<string, number>;
}

export interface Score {
  files: FileScore[];
  total: number;
}

const CODE = /\.(tsx?|jsx?)$/;
const STYLES = /\.css$/;

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && (CODE.test(entry.name) || STYLES.test(entry.name)))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
}

/** Stylesheets: check each declaration value outside custom-property definitions and var() calls. */
function scoreCss(source: string): Record<string, number> {
  const byKind: Record<string, number> = {};
  for (const match of source.matchAll(/(?:^|[;{\s])(--)?[\w-]+\s*:\s*([^;{}]+)/g)) {
    if (match[1]) continue; // defining a token is fine; using a raw value is not
    const value = match[2]!.replace(/var\([^)]*\)/g, '');
    for (const [kind, pattern] of CHECKS as [string, RegExp][]) if (pattern.test(value)) byKind[kind] = (byKind[kind] ?? 0) + 1;
  }
  return byKind;
}

export async function scoreDirectory(dir: string): Promise<Score> {
  const files = listFiles(dir);
  const eslint = new ESLint({
    cwd: dir,
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
        plugins: { 'machine-ui': machineUi },
        rules: { 'machine-ui/tokens-only': 'error' },
      },
    ],
  });
  const lintResults = new Map((await eslint.lintFiles(files.filter((f) => CODE.test(f)))).map((r) => [r.filePath, r]));

  const scored = files.map((path): FileScore => {
    const byKind: Record<string, number> = {};
    if (STYLES.test(path)) Object.assign(byKind, scoreCss(readFileSync(path, 'utf8')));
    for (const message of lintResults.get(path)?.messages ?? []) {
      if (message.ruleId === 'machine-ui/tokens-only' && message.messageId) byKind[message.messageId] = (byKind[message.messageId] ?? 0) + 1;
    }
    return { file: relative(dir, path), violations: Object.values(byKind).reduce((a, b) => a + b, 0), byKind };
  });
  return { files: scored, total: scored.reduce((sum, f) => sum + f.violations, 0) };
}

/** Pages are the component files; stylesheets add to the total but aren't pages. */
const perPage = (score: Score) => {
  const pages = score.files.filter((f) => CODE.test(f.file)).length || 1;
  return score.total / pages;
};

export function compareRuns(baseline: Score, withSkills: Score) {
  const withSkillsPerPage = perPage(withSkills);
  return { baselinePerPage: perPage(baseline), withSkillsPerPage, metTarget: withSkillsPerPage === 0 };
}
