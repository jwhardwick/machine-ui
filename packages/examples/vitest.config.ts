import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'examples',
    environment: 'jsdom',
    // The registry is built with import.meta.glob. Vitest's persistent module cache doesn't notice
    // newly added example files, so tests would run against a stale list. Correctness first.
    fsModuleCache: false,
  },
});
