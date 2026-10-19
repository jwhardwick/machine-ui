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
        'lucide-react',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'culori',
      ],
    },
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
    },
  }),
);
