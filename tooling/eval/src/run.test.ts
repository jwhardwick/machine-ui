import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { commandFor } from './run.ts';

const task = { id: 'pricing', prompt: 'Build a pricing page.' };

describe('eval runner', () => {
  it('uses the same prompt in both modes, adding only the consumer plugin for skills', () => {
    const baseline = commandFor(task, 'baseline');
    const skills = commandFor(task, 'skills');
    expect(baseline[2]).toBe(skills[2]);
    expect(baseline).not.toContain('--plugin-dir');
    expect(skills[skills.indexOf('--plugin-dir') + 1]).toMatch(/\/consumer$/);
  });

  it('dry-runs every task without calling a model', () => {
    const out = execFileSync(process.execPath, [join(import.meta.dirname, 'run.ts'), '--mode', 'skills', '--dry-run'], { encoding: 'utf8' });
    for (const id of ['settings', 'dashboard', 'pricing', 'inbox', 'onboarding']) expect(out).toContain(`[${id}]`);
    expect(out).toContain('--plugin-dir');
  });

  it('refuses an unknown mode', () => {
    expect(() => execFileSync(process.execPath, [join(import.meta.dirname, 'run.ts'), '--mode', 'nope'], { encoding: 'utf8', stdio: 'pipe' })).toThrow(/--mode/);
  });
});
