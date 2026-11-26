import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

/**
 * Figma extract: renders every spec in figma/specs.tsx and writes figma/out/components.json for the
 * Figma plugin (`pnpm figma:build`). Opt-in and not part of `pnpm check`: it loads web fonts from
 * Google Fonts, so text measures the way Figma will draw it.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'figma-extract',
      include: ['figma/**/*.test.tsx'],
      testTimeout: 120_000,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
        instances: [{ browser: 'chromium', viewport: { width: 1280, height: 900 } }],
      },
    },
  }),
);
