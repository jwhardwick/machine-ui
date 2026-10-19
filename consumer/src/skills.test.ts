import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '..');
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const registryItems = readdirSync(join(root, '../apps/site/public/r'))
  .filter((f) => f !== 'registry.json')
  .map((f) => f.replace(/\.json$/, ''));

describe('consumer plugin', () => {
  const skills = readdirSync(join(root, 'skills'));

  it('ships the four consumer skills from the spec', () => {
    expect(JSON.parse(read('.claude-plugin/plugin.json')).name).toBe('machine-ui');
    expect(skills.sort()).toEqual(['use-ds-compose', 'use-ds-install', 'use-ds-migrate', 'use-ds-theme']);
  });

  for (const skill of skills) {
    const source = read(`skills/${skill}/SKILL.md`);

    it(`${skill} has matching frontmatter and ends with a runnable verification step`, () => {
      expect(source).toMatch(new RegExp(`^---\\nname: ${skill}\\ndescription: .{40,}\\n---`));
      const verify = source.slice(source.lastIndexOf('## Verify'));
      expect(verify.startsWith('## Verify')).toBe(true);
      expect(verify).toMatch(/npm run build|npx tsc/);
    });

    it(`${skill} only names registry items that exist`, () => {
      const named = [...source.matchAll(/`(?:@machine-ui\/)?([a-z][a-z0-9-]+)`/g)].map((m) => m[1]!);
      // `@machine-ui/theme-<name>` is a placeholder, not a claim.
      const claimed = [...source.matchAll(/@machine-ui\/([a-z0-9-]+)(<?)/g)].filter((m) => !m[2] && !m[1]!.endsWith('-')).map((m) => m[1]!);
      for (const item of claimed) expect(registryItems, `@machine-ui/${item}`).toContain(item);
      if (skill === 'use-ds-compose') {
        // Item names in the "Use" column, ignoring notes in parentheses (variant names and the like).
        const rows = source.slice(source.indexOf('| Job |'), source.indexOf('## Page patterns')).split('\n').slice(2).filter(Boolean);
        const useColumn = rows.map((row) => (row.split('|')[2] ?? '').replace(/\([^)]*\)/g, '')).join(' ');
        const items = [...useColumn.matchAll(/`([a-z][a-z0-9-]+)`/g)].map((m) => m[1]!);
        expect(items.length).toBeGreaterThan(20);
        for (const item of items) expect(registryItems, item).toContain(item);
        expect(named.length).toBeGreaterThan(0);
      }
    });
  }

  it('use-ds-theme covers every seed setting and type pair', () => {
    const theme = read('skills/use-ds-theme/SKILL.md');
    for (const setting of ['hue', 'chroma', 'neutral', 'radius', 'density', 'separation', 'typePair', 'typeRatio', 'motion']) {
      expect(theme).toContain(`\`${setting}\``);
    }
    for (const pair of ['geist', 'civic', 'editorial', 'technical', 'humanist', 'heavy']) expect(theme).toContain(pair);
  });
});
