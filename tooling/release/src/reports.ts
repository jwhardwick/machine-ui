import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { apiReport } from './api-report.ts';
import { tokenReport } from './token-report.ts';

export const ROOT = join(import.meta.dirname, '../../..');
/** Published packages whose API is tracked. */
export const PACKAGES = ['tokens', 'theme-engine', 'ui'] as const;
export type PackageName = (typeof PACKAGES)[number];

export const reportPath = (file: string) => join(ROOT, 'api', file);
export const apiFile = (pkg: PackageName) => `${pkg}.api.json`;
export const TOKENS_FILE = 'tokens.json';

const serialise = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

/** Every report, freshly generated from source, keyed by file name. */
export function generateReports(): Record<string, string> {
  return {
    ...Object.fromEntries(PACKAGES.map((pkg) => [apiFile(pkg), serialise(apiReport(join(ROOT, 'packages', pkg)))])),
    [TOKENS_FILE]: serialise(tokenReport()),
  };
}

export function writeReports(): string[] {
  const reports = generateReports();
  for (const [file, content] of Object.entries(reports)) writeFileSync(reportPath(file), content);
  return Object.keys(reports);
}

/** Files whose committed content no longer matches the source. */
export function staleReports(): string[] {
  return Object.entries(generateReports())
    .filter(([file, content]) => {
      try {
        return readFileSync(reportPath(file), 'utf8') !== content;
      } catch {
        return true;
      }
    })
    .map(([file]) => file);
}
