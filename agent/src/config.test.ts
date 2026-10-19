import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseConfig } from './config.ts';

const read = (path: string) => readFileSync(join(import.meta.dirname, '..', path), 'utf8');

describe('config.yaml', () => {
  it('accepts this repo’s config and the template default', () => {
    const repo = parseConfig(read('config.yaml'));
    expect(repo.autonomy).toEqual({ patch: 'auto-merge', minor: 'review', major: 'approval' });
    const template = parseConfig(read('config.template.yaml'));
    expect(template.autonomy).toEqual({ patch: 'review', minor: 'review', major: 'approval' });
  });

  it('fills defaults from the spec', () => {
    const config = parseConfig('target:\n  packages: [packages/ui]\n');
    expect(config.issues).toEqual({ source: 'github', readyLabel: 'agent:ready', escalateLabel: 'needs-human' });
    expect(config.retries).toBe(3);
    expect(config.planWaitHours).toBe(2);
    expect(config.autonomy.major).toBe('approval');
  });

  it('rejects unsafe or malformed settings with a readable message', () => {
    expect(() => parseConfig('target:\n  packages: []\n')).toThrow(/target.packages/);
    expect(() => parseConfig('target:\n  packages: [x]\nautonomy:\n  major: auto-merge\n')).toThrow(/autonomy.major/);
    expect(() => parseConfig('target:\n  packages: [x]\nretries: 50\n')).toThrow(/retries/);
    expect(() => parseConfig('target: [')).toThrow(/YAML/);
  });
});
