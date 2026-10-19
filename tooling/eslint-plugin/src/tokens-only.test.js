import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { afterAll, describe, it } from 'vitest';
import rule from './tokens-only.js';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.afterAll = afterAll;

const tester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const jsx = (className) => `const a = <div className="${className}" />;`;

tester.run('tokens-only', rule, {
  valid: [
    jsx('bg-primary text-primary-foreground h-(--control-md) rounded-md'),
    jsx('border-(length:--card-border-width) shadow-sm duration-(--motion-fast)'),
    "import { Slot } from 'radix-ui';",
    'const label = "International shipping";',
    'const a = <div style={{ flex: undefined }} />;',
  ],
  invalid: [
    { code: jsx('bg-[#fff]'), errors: [{ messageId: 'rawColor' }] },
    { code: 'const c = "oklch(0.5 0.1 20)";', errors: [{ messageId: 'rawColor' }] },
    { code: jsx('p-[13px]'), errors: [{ messageId: 'rawPx' }] },
    { code: 'const w = `${n}px 4px`;', errors: [{ messageId: 'rawPx' }] },
    { code: jsx('bg-red-500'), errors: [{ messageId: 'paletteUtility' }] },
    { code: jsx('text-white'), errors: [{ messageId: 'paletteUtility' }] },
    { code: jsx('bg-linear-to-r from-primary'), errors: [{ messageId: 'gradient' }] },
    { code: jsx("font-['Inter']"), errors: [{ messageId: 'fontName' }] },
    { code: 'const f = "Figtree";', errors: [{ messageId: 'fontName' }] },
    { code: 'const a = <div style={{ padding: 4 }} />;', errors: [{ messageId: 'rawStyleNumber' }] },
  ],
});
