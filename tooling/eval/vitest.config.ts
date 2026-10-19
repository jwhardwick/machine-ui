import { defineProject } from 'vitest/config';

export default defineProject({ test: { name: 'eval', testTimeout: 30_000 } });
