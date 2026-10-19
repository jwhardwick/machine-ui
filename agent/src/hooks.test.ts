import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const hook = (name: string) => join(import.meta.dirname, '../hooks', name);

/** Run a hook the way Claude Code does: JSON on stdin; exit 2 blocks with stderr as the reason. */
function run(name: string, input: object, cwd = process.cwd()) {
  const result = spawnSync('node', [hook(name)], { input: JSON.stringify({ cwd, ...input }), encoding: 'utf8' });
  return { code: result.status, stderr: result.stderr };
}

const bash = (command: string, cwd?: string) => run('guard-bash.mjs', { tool_name: 'Bash', tool_input: { command } }, cwd);
const edit = (file_path: string) => run('guard-paths.mjs', { tool_name: 'Edit', tool_input: { file_path } });

describe('guard-bash', () => {
  it.each([
    'git push origin main',
    'git push origin HEAD:main',
    'git push -f origin feature',
    'git push --force-with-lease',
    'npm publish',
    'pnpm publish --access public',
    'pnpm changeset publish',
    'gh pr merge 12 --squash',
    'git commit --no-verify -m wip',
    "sed -i '' 's/a/b/' .github/workflows/ci.yml",
  ])('blocks %s', (command) => {
    const { code, stderr } = bash(command);
    expect(code).toBe(2);
    expect(stderr.length).toBeGreaterThan(10);
  });

  it.each(['git push origin agent/issue-12', 'git push -u origin feature/badge-loading', 'pnpm check', 'git commit -m "fix: badge"', 'cat .github/workflows/ci.yml'])(
    'allows %s',
    (command) => {
      expect(bash(command).code).toBe(0);
    },
  );

  it('blocks a bare `git push` while on main', () => {
    const repo = mkdtempSync(join(tmpdir(), 'guard-'));
    execFileSync('git', ['init', '-q', '-b', 'main'], { cwd: repo });
    expect(bash('git push', repo).code).toBe(2);
    execFileSync('git', ['checkout', '-q', '-b', 'agent/x'], { cwd: repo });
    expect(bash('git push', repo).code).toBe(0);
  });
});

describe('guard-paths', () => {
  it.each(['.github/workflows/ci.yml', '/repo/.github/workflows/release.yml', 'api/ui.api.json', 'apps/storybook/visual/__screenshots__/x.png', '.changeset/config.json', 'agent/config.yaml'])(
    'blocks edits to %s',
    (path) => {
      expect(edit(path).code).toBe(2);
    },
  );

  it.each(['packages/ui/src/components/button.tsx', '.changeset/brave-otters.md', 'docs/decisions/0004.md'])('allows edits to %s', (path) => {
    expect(edit(path).code).toBe(0);
  });
});

describe('lint-after-edit', () => {
  const root = join(import.meta.dirname, '../..');
  const lint = (file_path: string) => run('lint-after-edit.mjs', { tool_name: 'Edit', tool_input: { file_path } }, root);

  it('reports token violations in component code back to the agent', async () => {
    const { writeFileSync, rmSync } = await import('node:fs');
    const file = join(root, 'packages/ui/src/components/zz-probe.tsx');
    writeFileSync(file, 'export const probe = "bg-red-500";\n');
    try {
      const { code, stderr } = lint(file);
      expect(code).toBe(2);
      expect(stderr).toContain('tokens-only');
    } finally {
      rmSync(file);
    }
  });

  it('stays quiet for clean files and files outside the design system', () => {
    expect(lint(join(root, 'packages/ui/src/components/button.tsx')).code).toBe(0);
    expect(lint(join(root, 'docs/SPEC.md')).code).toBe(0);
  });
});
