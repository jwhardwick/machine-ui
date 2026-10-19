import { defineProject } from 'vitest/config';

export default defineProject({ test: { name: 'release', testTimeout: 30_000 } });
