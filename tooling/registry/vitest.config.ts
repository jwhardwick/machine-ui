import { defineProject } from 'vitest/config';

export default defineProject({ test: { name: 'registry', testTimeout: 30_000, fsModuleCache: false } });
