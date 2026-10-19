import type { ThemeSeed } from './seed.ts';

const ledger: ThemeSeed = {
  name: 'ledger',
  hue: 28,
  chroma: 0.35,
  neutral: 'warm',
  radius: 0.15,
  density: 0.7,
  separation: 0.1,
  typePair: 'editorial',
  typeRatio: 1.25,
  motion: 'subtle',
};

const concrete: ThemeSeed = {
  name: 'concrete',
  hue: 95,
  chroma: 0.9,
  neutral: 'neutral',
  radius: 0,
  density: 0.3,
  separation: 0,
  typePair: 'brutalist',
  typeRatio: 1.333,
  motion: 'none',
};

const meadow: ThemeSeed = {
  name: 'meadow',
  hue: 155,
  chroma: 0.55,
  neutral: 'warm',
  radius: 0.75,
  density: 0.8,
  separation: 0.85,
  typePair: 'humanist',
  typeRatio: 1.2,
  motion: 'expressive',
};

const consoleTheme: ThemeSeed = {
  name: 'console',
  hue: 215,
  chroma: 0.45,
  neutral: 'cool',
  radius: 0.2,
  density: 0,
  separation: 0.2,
  typePair: 'technical',
  typeRatio: 1.125,
  motion: 'subtle',
};

const ember: ThemeSeed = {
  name: 'ember',
  hue: 45,
  chroma: 0.8,
  neutral: 'warm',
  radius: 0.45,
  density: 0.5,
  separation: 0.6,
  typePair: 'classic',
  typeRatio: 1.25,
  motion: 'expressive',
};

/** Editorial, brutalist, soft consumer, dense dashboard, expressive. */
export const REFERENCE_THEMES: readonly ThemeSeed[] = [ledger, concrete, meadow, consoleTheme, ember];

export const DEFAULT_SEED: ThemeSeed = ledger;
