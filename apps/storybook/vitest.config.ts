import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [storybookTest({ configDir: '.storybook' })],
    // Pre-bundle up front so a cold cache doesn't reload the browser mid-run.
    optimizeDeps: {
      include: [
        '@storybook/addon-docs',
        '@storybook/addon-a11y/preview',
        '@storybook/react-vite',
        '@storybook/react-dom-shim',
        'storybook/test',
        'axe-core',
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'radix-ui',
        'radix-ui/internal',
        'cmdk',
        'vaul',
        'sonner',
        'recharts',
        'react-day-picker',
        'date-fns',
        'embla-carousel-react',
        'input-otp',
        'react-resizable-panels',
        '@tanstack/react-table',
        'lucide-react',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'culori',
      ],
    },
    test: {
      name: 'storybook',
      // The first story in each file pays for a cold browser page; on a loaded machine that alone can
      // exceed the 15s default. A genuinely hung story still fails, just later.
      testTimeout: 60_000,
      // Browser pages compete for one CPU and GPU; a few at a time keeps timing-sensitive stories
      // (streaming text, animated closes) honest on a busy machine.
      maxWorkers: 3,
      browser: {
        enabled: true,
        headless: true,
        // Parallel pages count as background pages, and Chromium throttles their timers and pauses
        // animation frames, which stalls animated closes and streamed text. Tests need full speed.
        provider: playwright({
          launchOptions: {
            args: ['--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
          },
        }),
        instances: [{ browser: 'chromium' }],
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
    },
  }),
);
