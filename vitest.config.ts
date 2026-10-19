import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*', 'tooling/*', 'apps/site', 'agent'],
    passWithNoTests: true,
  },
});
