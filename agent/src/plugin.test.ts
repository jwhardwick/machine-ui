import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '..');
const read = (path: string) => readFileSync(join(root, path), 'utf8');

function frontmatter(source: string): Record<string, string> {
  const block = /^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? '';
  return Object.fromEntries(block.split('\n').map((line) => [line.slice(0, line.indexOf(':')).trim(), line.slice(line.indexOf(':') + 1).trim()]));
}

describe('plugin', () => {
  it('has a manifest', () => {
    const manifest = JSON.parse(read('.claude-plugin/plugin.json'));
    expect(manifest.name).toBe('machine-ui-maintainer');
    expect(manifest.description.length).toBeGreaterThan(20);
  });

  it('wires every hook script that exists, and only scripts that exist', () => {
    const hooks = JSON.parse(read('hooks/hooks.json')).hooks as Record<string, { hooks: { command: string }[] }[]>;
    const commands = Object.values(hooks).flatMap((groups) => groups.flatMap((g) => g.hooks.map((h) => h.command)));
    const scripts = commands.map((c) => /hooks\/([\w-]+\.mjs)/.exec(c)?.[1]);
    for (const script of scripts) expect(existsSync(join(root, 'hooks', script!)), script).toBe(true);
    expect(new Set(scripts)).toEqual(new Set(['guard-bash.mjs', 'guard-paths.mjs', 'lint-after-edit.mjs']));
  });

  const skills = readdirSync(join(root, 'skills'));

  it('ships the seven maintainer skills from the spec', () => {
    expect(skills.sort()).toEqual(['ds-a11y', 'ds-component', 'ds-docs', 'ds-performance', 'ds-release', 'ds-tokens', 'ds-triage']);
  });

  for (const skill of skills) {
    it(`${skill} has matching frontmatter and ends with a runnable verification step`, () => {
      const source = read(`skills/${skill}/SKILL.md`);
      const meta = frontmatter(source);
      expect(meta.name).toBe(skill);
      expect(meta.description!.length).toBeGreaterThan(40);
      const verify = source.slice(source.lastIndexOf('## Verify'));
      expect(verify.startsWith('## Verify')).toBe(true);
      expect(verify).toMatch(/pnpm |gh /);
    });
  }

  it('keeps the triager and reviewer read-only', () => {
    for (const agent of ['ds-triager', 'ds-reviewer']) {
      expect(frontmatter(read(`agents/${agent}.md`)).tools).toBe('Read, Grep, Glob, Bash');
    }
  });

  it('only references commands that exist in the repo', () => {
    const scripts = Object.keys(JSON.parse(readFileSync(join(root, '../package.json'), 'utf8')).scripts);
    const all = skills.map((s) => read(`skills/${s}/SKILL.md`)).join('\n');
    const used = [...all.matchAll(/pnpm ([a-z][\w:-]*)/g)].map((m) => m[1]!).filter((c) => !['changeset', '--filter'].includes(c));
    for (const command of new Set(used)) expect(scripts, `pnpm ${command}`).toContain(command);
  });
});
