import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'theme-engine',
    // Engine tests are CPU-bound (sweeps and fuzzing build hundreds of palettes), so they get more
    // than the default 5s; on a busy machine the default fails them without anything being wrong.
    testTimeout: 30_000,
  },
});
