import type { ThemeSeed } from '@machine-ui/tokens';
import { themeBrief } from './brief.ts';
import { themeToCss } from './css.ts';
import { generateTheme } from './generate.ts';

export interface ThemeExport {
  css: string;
  json: string;
  /** Markdown brief for coding agents (`theme-brief.md`). */
  brief: string;
}

export function exportTheme(seed: ThemeSeed): ThemeExport {
  const tokens = generateTheme(seed);
  const { shared, light, dark } = tokens;
  return {
    css: `${themeToCss(tokens)}\n`,
    json: `${JSON.stringify({ seed: tokens.seed, tokens: { shared, light, dark } }, null, 2)}\n`,
    brief: themeBrief(tokens.seed),
  };
}
