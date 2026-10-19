import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

/**
 * Visual regression: screenshots of the theme matrix and screens, compared against committed
 * baselines in visual/__screenshots__. Baselines are per platform (font rendering differs), so CI
 * keeps its own. Approve intended changes with `pnpm test:visual:update` and review the images.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: 'visual',
      include: ['visual/**/*.test.tsx'],
      setupFiles: ['visual/setup.ts'],
      testTimeout: 120_000,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({
          // Charts and streamed text then render in their final state instead of mid-animation.
          contextOptions: { reducedMotion: 'reduce' },
          launchOptions: {
            args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--font-render-hinting=none'],
          },
        }),
        instances: [{ browser: 'chromium', viewport: { width: 1280, height: 900 } }],
        expect: {
          toMatchScreenshot: {
            comparatorName: 'pixelmatch',
            // Tolerate anti-aliasing noise, not real changes: 0.2% of pixels.
            comparatorOptions: { threshold: 0.1, allowedMismatchedPixelRatio: 0.002 },
          },
        },
      },
    },
  }),
);
