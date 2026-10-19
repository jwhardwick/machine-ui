import type { ThemeSeed } from './seed.ts';

/** Crisp, near-neutral product UI. The default. */
const graphite: ThemeSeed = {
  name: 'graphite',
  hue: 255,
  chroma: 0.12,
  neutral: 'cool',
  radius: 0.45,
  density: 0.45,
  separation: 0.3,
  typePair: 'geist',
  typeRatio: 1.2,
  motion: 'subtle',
};

/** Calm public-service utility: deep teal, clear borders, plain type. */
const harbor: ThemeSeed = {
  name: 'harbor',
  hue: 195,
  chroma: 0.55,
  neutral: 'cool',
  radius: 0.25,
  density: 0.55,
  separation: 0.15,
  typePair: 'civic',
  typeRatio: 1.2,
  motion: 'subtle',
};

/** Editorial: ink violet, airy, a high-contrast serif for display only. */
const folio: ThemeSeed = {
  name: 'folio',
  hue: 285,
  chroma: 0.4,
  neutral: 'neutral',
  radius: 0.15,
  density: 0.75,
  separation: 0.1,
  typePair: 'editorial',
  typeRatio: 1.333,
  motion: 'subtle',
};

/** Dense operational dashboard: compact, technical type, tight corners. */
const consoleTheme: ThemeSeed = {
  name: 'console',
  hue: 230,
  chroma: 0.5,
  neutral: 'cool',
  radius: 0.15,
  density: 0,
  separation: 0.2,
  typePair: 'technical',
  typeRatio: 1.125,
  motion: 'subtle',
};

/** Soft consumer app: bright magenta, generous corners, lifted surfaces. */
const bloom: ThemeSeed = {
  name: 'bloom',
  hue: 350,
  chroma: 0.75,
  neutral: 'warm',
  radius: 0.85,
  density: 0.8,
  separation: 0.85,
  typePair: 'humanist',
  typeRatio: 1.2,
  motion: 'expressive',
};

/** Loud and confident: saturated amber, heavy display type, shadows over lines. */
const forge: ThemeSeed = {
  name: 'forge',
  hue: 55,
  chroma: 0.95,
  neutral: 'neutral',
  radius: 0.3,
  density: 0.35,
  separation: 0.6,
  typePair: 'heavy',
  typeRatio: 1.333,
  motion: 'expressive',
};

export const REFERENCE_THEMES: readonly ThemeSeed[] = [graphite, harbor, folio, consoleTheme, bloom, forge];

export const DEFAULT_SEED: ThemeSeed = graphite;
