// The token contract consumers depend on: names, not values (values are theme output).
import { COLOR_ROLES, MODE_TOKENS, REFERENCE_THEMES, SHARED_TOKENS, TYPE_PAIR_IDS, type ThemeSeed } from '@machine-ui/tokens';

export interface TokenReport {
  colorRoles: string[];
  sharedTokens: string[];
  modeTokens: string[];
  typePairs: string[];
  /** Preset name → seed. Changing a preset's values restyles consumers, but renames nothing. */
  presets: Record<string, Omit<ThemeSeed, 'name'>>;
}

export function tokenReport(): TokenReport {
  const sorted = (items: readonly string[]) => [...items].sort((a, b) => a.localeCompare(b, 'en'));
  return {
    colorRoles: sorted(COLOR_ROLES),
    sharedTokens: sorted(SHARED_TOKENS),
    modeTokens: sorted(MODE_TOKENS),
    typePairs: sorted(TYPE_PAIR_IDS),
    presets: Object.fromEntries(
      [...REFERENCE_THEMES].sort((a, b) => a.name.localeCompare(b.name, 'en')).map(({ name, ...seed }) => [name, seed]),
    ),
  };
}
