import type { ThemeSeed } from './seed.ts';

/** Semantic colour roles, named as shadcn/ui names them. */
export const COLOR_ROLES = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'link',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
] as const;

export type ColorRole = (typeof COLOR_ROLES)[number];

export const TYPE_STEPS = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'] as const;
export type TypeStep = (typeof TYPE_STEPS)[number];

export const ELEVATION_TOKENS = ['elevation-sm', 'elevation-md', 'elevation-lg'] as const;

/** Tokens that are the same in light and dark mode. Names omit the leading `--`. */
export const SHARED_TOKENS = [
  'radius',
  'corner-sm',
  'corner-md',
  'corner-lg',
  'corner-xl',
  'typeface-display',
  'typeface-text',
  'typeface-code',
  ...TYPE_STEPS.map((step) => `type-${step}` as const),
  'space-unit',
  'control-sm',
  'control-md',
  'control-lg',
  'border-width',
  'card-border-width',
  'motion-fast',
  'motion-normal',
  'motion-slow',
  'motion-ease-standard',
  'motion-ease-emphasized',
] as const;

/** Tokens that differ between light and dark mode. */
export const MODE_TOKENS = [...COLOR_ROLES, ...ELEVATION_TOKENS] as const;

export type SharedToken = (typeof SHARED_TOKENS)[number];
export type ModeToken = (typeof MODE_TOKENS)[number];

/** Token name (without `--`) → CSS value. */
export type TokenMap<K extends string = string> = Record<K, string>;

export interface ThemeTokens {
  seed: ThemeSeed;
  shared: TokenMap<SharedToken>;
  light: TokenMap<ModeToken>;
  dark: TokenMap<ModeToken>;
}
