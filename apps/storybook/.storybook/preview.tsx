import type { Decorator, Preview } from '@storybook/react-vite';
import { TYPE_PAIRS } from '@machine-ui/tokens';
import '../src/styles.css';
import { applyGlobals, MODE_GLOBAL, THEME_GLOBAL } from './theme.ts';

function loadFonts() {
  if (document.querySelector('link[data-mui-fonts]')) return;
  const families = Object.values(TYPE_PAIRS)
    .map((pair) => pair.googleFontsQuery)
    .join('&');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  link.dataset.muiFonts = '';
  document.head.appendChild(link);
}

// applyTheme is idempotent and cached, so running it on every render keeps the preview in
// step with the theme editor and guarantees the theme is in place before play functions and axe.
const withTheme: Decorator = (Story, context) => {
  applyGlobals(context.globals);
  return <Story />;
};

loadFonts();

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: { [THEME_GLOBAL]: '', [MODE_GLOBAL]: 'light' },
  globalTypes: {
    [MODE_GLOBAL]: {
      description: 'Colour mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: { disable: true },
  },
};

export default preview;
