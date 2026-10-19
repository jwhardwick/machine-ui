import { defineProject } from 'vitest/config';

export default defineProject({ test: { name: 'site', include: ['src/**/*.test.ts'] } });
