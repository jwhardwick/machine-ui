import { applyTheme, parseSeed } from '@machine-ui/theme-engine';
import { DEFAULT_SEED, type ThemeSeed } from '@machine-ui/tokens';

/** Globals the theme editor writes; shared by the manager panel and the preview. */
export const THEME_GLOBAL = 'theme';
export const MODE_GLOBAL = 'mode';

export function seedFromGlobals(globals: Record<string, unknown>): ThemeSeed {
  return parseSeed(globals[THEME_GLOBAL] as string | undefined) ?? DEFAULT_SEED;
}

export function modeFromGlobals(globals: Record<string, unknown>): 'light' | 'dark' {
  return globals[MODE_GLOBAL] === 'dark' ? 'dark' : 'light';
}

export function applyGlobals(globals: Record<string, unknown>) {
  applyTheme(seedFromGlobals(globals), { mode: modeFromGlobals(globals) });
}
