#!/usr/bin/env node
// PreToolUse(Bash): refuse commands that cross the agent's trust boundary.
import { execFileSync } from 'node:child_process';
import { block, protectedReason, readInput } from './policy.mjs';

const input = await readInput();
const command = String(input.tool_input?.command ?? '');
const segments = command.split(/&&|\|\||;|\n|\|/).map((s) => s.trim()).filter(Boolean);

function currentBranch(cwd) {
  try {
    return execFileSync('git', ['symbolic-ref', '--short', 'HEAD'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

const MUTATING = /\bsed\s+(-\w*i|--in-place)|\btee\b|\brm\b|\bmv\b|\bcp\b|>|\btruncate\b|\bperl\s+-\w*i|\bchmod\b/;

for (const segment of segments) {
  if (/\bgit\s+push\b/.test(segment)) {
    if (/\s(-f|--force|--force-with-lease)(\s|=|$)/.test(segment)) block('force pushes are not allowed.');
    if (/(\s|:)(main|master)(\s|$)/.test(segment)) block('never push to main; push a branch and open a PR.');
    const args = segment.replace(/^.*\bgit\s+push\b/, '').split(/\s+/).filter((a) => a && !a.startsWith('-'));
    if (args.length < 2 && ['main', 'master'].includes(currentBranch(input.cwd ?? process.cwd()) ?? '')) {
      block('you are on main; create a branch before pushing.');
    }
  }
  if (/\b(npm|pnpm|yarn)\s+(\S+\s+)?publish\b|\bchangeset\s+publish\b/.test(segment)) block('publishing runs only from the protected release workflow.');
  if (/\bgh\s+pr\s+merge\b/.test(segment)) block('merging is done by CI auto-merge or a maintainer, never the agent.');
  if (/--no-verify\b/.test(segment)) block('hooks and checks may not be skipped.');
  if (MUTATING.test(segment)) {
    for (const token of segment.split(/\s+/)) {
      const reason = protectedReason(token.replace(/^['"]|['"]$/g, ''));
      if (reason) block(`${token}: ${reason}.`);
    }
  }
}
process.exit(0);
