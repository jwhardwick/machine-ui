import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import machineUi from '@machine-ui/eslint-plugin';

export default tseslint.config(
  { ignores: ['**/node_modules/**', '**/dist/**', '**/storybook-static/**', '.superpowers/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // Tokens only in components. Never disable this rule; fix the styling instead.
    files: ['packages/ui/src/**/*.{ts,tsx}'],
    plugins: { 'machine-ui': machineUi },
    linterOptions: { noInlineConfig: true },
    rules: { 'machine-ui/tokens-only': 'error' },
  },
);
