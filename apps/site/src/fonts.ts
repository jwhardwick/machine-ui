import { TYPE_PAIRS } from '@machine-ui/tokens';

/** Load every curated pair so switching pairs is instant. */
export function loadFonts() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${Object.values(TYPE_PAIRS)
    .map((pair) => pair.googleFontsQuery)
    .join('&')}&display=swap`;
  document.head.appendChild(link);
}
