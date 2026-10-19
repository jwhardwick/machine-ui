import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { REFERENCE_THEMES } from '@machine-ui/tokens';
import { describe, expect, it } from 'vitest';
import { exportTheme } from './export.ts';
import { serializeSeed } from './url.ts';

const forge = REFERENCE_THEMES.find((t) => t.name === 'forge')!;
/** A deliberately flat, still variant: sharp corners, borders, no motion. */
const concrete = { ...forge, name: 'concrete', radius: 0, separation: 0, motion: 'none' as const };
const meadow = REFERENCE_THEMES.find((t) => t.name === 'bloom')!;

describe('exportTheme', () => {
  it('emits CSS, JSON tokens and an agent brief', () => {
    const out = exportTheme(concrete);
    expect(out.css).toContain(':root {');
    const json = JSON.parse(out.json);
    expect(json.seed).toEqual(concrete);
    expect(json.tokens.light.primary).toMatch(/^oklch/);
    expect(out.brief).toContain(serializeSeed(concrete));
  });

  it('describes personality and do/don’t rules in the brief', () => {
    const brief = exportTheme(concrete).brief;
    expect(brief).toContain('Sharp corners');
    expect(brief).toContain('Borders, not shadows');
    expect(brief).toContain('No gradients');
    expect(brief).toContain("Don't animate");
    const soft = exportTheme(meadow).brief;
    expect(soft).toContain('Shadows, not borders');
    expect(soft).not.toContain("Don't animate");
  });
});

describe('framework independence', () => {
  it('only apply.ts touches the DOM or React', () => {
    const dir = fileURLToPath(new URL('.', import.meta.url));
    const offenders = readdirSync(dir, { recursive: true, encoding: 'utf8' })
      .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts') && f !== 'apply.ts')
      .filter((f) => /\b(document|window|HTMLElement)\b|from ['"]react/.test(readFileSync(dir + f, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
