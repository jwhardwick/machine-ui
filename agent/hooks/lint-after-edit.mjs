#!/usr/bin/env node
// PostToolUse(Edit|Write|MultiEdit): lint design-system source right after the agent edits it, and
// hand any problems straight back (exit 2) so token violations are fixed before anything else.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readInput } from './policy.mjs';

const input = await readInput();
const file = String(input.tool_input?.file_path ?? '');
const cwd = input.cwd ?? process.cwd();
const eslint = join(cwd, 'node_modules/.bin/eslint');

// Only component and example source is held to tokens-only; everything else is linted in CI.
if (!/packages\/(ui|examples)\/src\/.+\.(ts|tsx)$/.test(file) || !existsSync(eslint) || !existsSync(file)) process.exit(0);

try {
  execFileSync(eslint, ['--no-warn-ignored', file], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (error) {
  process.stderr.write(`Lint failed for ${file}. Fix these before continuing:\n${error.stdout ?? ''}${error.stderr ?? ''}`);
  process.exit(2);
}
process.exit(0);
