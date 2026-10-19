import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { ROOT } from './reports.ts';

const load = (path: string) => parse(readFileSync(join(ROOT, path), 'utf8'));
const runs = (workflow: { jobs: Record<string, { steps: { run?: string }[] }> }) =>
  Object.values(workflow.jobs).flatMap((job) => job.steps.map((s) => s.run ?? ''));

describe('CI workflow', () => {
  const ci = load('.github/workflows/ci.yml');

  it('runs every gate in `pnpm check`', () => {
    const check: string = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).scripts.check;
    const gates = check.split('&&').map((s) => s.trim());
    const steps = runs(ci).join('\n');
    for (const gate of gates) expect(steps, gate).toContain(gate);
  });

  it('checks the version bump against changesets on PRs, with full history', () => {
    const job = ci.jobs['release-check'];
    expect(job.if).toContain('pull_request');
    expect(job.steps[0].with['fetch-depth']).toBe(0);
    expect(runs({ jobs: { job } }).join('\n')).toContain('release:bump --base origin/${{ github.base_ref }} --check-changeset');
  });

  it('is read-only and never uses pull_request_target', () => {
    expect(ci.permissions).toEqual({ contents: 'read' });
    expect(Object.keys(ci.on)).not.toContain('pull_request_target');
  });
});

describe('release workflow', () => {
  it('runs from a protected environment on main only', () => {
    const release = load('.github/workflows/release.yml');
    expect(release.on).toEqual({ push: { branches: ['main'] } });
    for (const job of Object.values(release.jobs) as { environment?: string }[]) expect(job.environment).toBe('release');
  });
});

describe('issue templates', () => {
  const dir = join(ROOT, '.github/ISSUE_TEMPLATE');
  const forms = readdirSync(dir).filter((f) => f !== 'config.yml');

  it('disable blank issues', () => {
    expect(load('.github/ISSUE_TEMPLATE/config.yml').blank_issues_enabled).toBe(false);
  });

  for (const form of forms) {
    it(`${form} requires acceptance criteria`, () => {
      const body = load(`.github/ISSUE_TEMPLATE/${form}`).body as { id?: string; validations?: { required?: boolean } }[];
      expect(body.find((field) => field.id === 'acceptance')?.validations?.required).toBe(true);
    });
  }
});
