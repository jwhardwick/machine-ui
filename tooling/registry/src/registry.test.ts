import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateTheme } from '@machine-ui/theme-engine';
import { DEFAULT_SEED, MODE_TOKENS, REFERENCE_THEMES, SHARED_TOKENS } from '@machine-ui/tokens';
import { registryItemSchema, registrySchema } from 'shadcn/schema';
import { describe, expect, it } from 'vitest';
import { buildRegistry, OUT_DIR, staleFiles, UI_DIR } from './build.ts';

const files = buildRegistry();
const items = Object.entries(files)
  .filter(([name]) => name !== 'registry.json')
  .map(([, item]) => item as ReturnType<typeof registryItemSchema.parse>);
const byName = new Map(items.map((item) => [item.name, item]));

describe('registry', () => {
  it('validates against shadcn’s schemas', () => {
    for (const item of items) expect(registryItemSchema.safeParse(item).error, item.name).toBeUndefined();
    expect(registrySchema.safeParse(files['registry.json']).error).toBeUndefined();
  });

  it('has one ui item per component, the shared libs, a base and a theme per preset', () => {
    const components = readdirSync(join(UI_DIR, 'components')).map((f) => f.replace(/\.tsx$/, ''));
    for (const name of components) expect(byName.get(name)?.type, name).toBe('registry:ui');
    expect(byName.get('machine-ui-styles')?.type).toBe('registry:lib');
    expect(byName.get('use-reduced-motion')?.type).toBe('registry:hook');
    expect(byName.get('machine-ui-base')?.type).toBe('registry:theme');
    for (const preset of REFERENCE_THEMES) expect(byName.get(`theme-${preset.name}`)?.type, preset.name).toBe('registry:theme');
  });

  it('rewrites every relative import to a shadcn alias', () => {
    for (const item of items) {
      for (const file of item.files ?? []) {
        expect(file.content, `${item.name}`).not.toMatch(/from ['"]\.{1,2}\//);
        expect(file.content, `${item.name}`).not.toMatch(/from ['"][^'"]+\.tsx?['"]/);
      }
    }
    expect(byName.get('button')!.files![0]!.content).toContain("from '@/lib/utils'");
    expect(byName.get('date-picker')!.files![0]!.content).toContain("from '@/components/ui/calendar'");
  });

  it('marks client components for React Server Components projects (Next.js)', () => {
    const CLIENT_ONLY = /\buse(State|Effect|LayoutEffect|Context|Ref|Callback|Memo|Id|SyncExternalStore|ComposedRefs)\b|\bcreateContext\b|from '(radix-ui|vaul|cmdk|sonner|recharts|embla-carousel-react|input-otp|react-day-picker|@tanstack\/react-table|react-resizable-panels)'|\bon[A-Z]\w*=\{/;
    const offenders = items
      .flatMap((item) => (item.files ?? []).map((file) => ({ name: item.name, content: file.content ?? '' })))
      .filter(({ content }) => CLIENT_ONLY.test(content) && !content.startsWith("'use client';"))
      .map(({ name }) => name);
    expect(offenders).toEqual([]);
    expect(byName.get('card')!.files![0]!.content).not.toContain("'use client'");
  });

  it('declares every dependency it imports, and only real ones', () => {
    const uiPackage = JSON.parse(readFileSync(join(UI_DIR, '../package.json'), 'utf8'));
    for (const item of items) {
      for (const dep of item.registryDependencies ?? []) {
        if (dep === 'utils') continue;
        expect(byName.has(dep.replace('@machine-ui/', '')), `${item.name} → ${dep}`).toBe(true);
      }
      for (const dep of item.dependencies ?? []) {
        const [, name, version] = /^(@?[^@]+)@(.+)$/.exec(dep)!;
        expect(uiPackage.dependencies[name!], `${item.name}: ${dep}`).toBe(version);
      }
    }
    const datePicker = byName.get('date-picker')!;
    expect(datePicker.registryDependencies).toEqual(expect.arrayContaining(['@machine-ui/calendar', '@machine-ui/popover', '@machine-ui/button', 'utils', '@machine-ui/machine-ui-base']));
    expect(datePicker.dependencies).toEqual(expect.arrayContaining([expect.stringMatching(/^date-fns@/), expect.stringMatching(/^lucide-react@/)]));
  });

  it('maps every token into Tailwind in the base, without wiping the consumer’s palette', () => {
    const base = byName.get('machine-ui-base')!;
    expect(base.cssVars?.theme?.['color-primary']).toBe('var(--primary)');
    expect(base.cssVars?.theme?.['text-base']).toBe('var(--type-base)');
    expect(base.cssVars?.theme?.['animate-enter']).toContain('var(--motion-normal)');
    expect(JSON.stringify(base)).not.toContain('initial');
    expect(Object.keys(base.css ?? {})).toContain('@keyframes mui-enter');
  });

  it('carries each preset’s exact engine output', () => {
    for (const preset of [DEFAULT_SEED, ...REFERENCE_THEMES]) {
      const tokens = generateTheme(preset);
      const item = byName.get(`theme-${preset.name}`)!;
      for (const token of [...SHARED_TOKENS, ...MODE_TOKENS]) {
        expect(item.cssVars?.light?.[token], `${preset.name} light ${token}`).toBe({ ...tokens.shared, ...tokens.light }[token]);
      }
      for (const token of MODE_TOKENS) expect(item.cssVars?.dark?.[token], `${preset.name} dark ${token}`).toBe(tokens.dark[token]);
    }
  });

  it('is committed and up to date in the site (run `pnpm registry:build`)', () => {
    expect(staleFiles()).toEqual([]);
    expect(readdirSync(OUT_DIR).length).toBe(Object.keys(files).length);
  });
});
