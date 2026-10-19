export type NeutralTemperature = 'cool' | 'neutral' | 'warm';
export type MotionLevel = 'none' | 'subtle' | 'expressive';
export type TypePairId = 'editorial' | 'grotesk' | 'humanist' | 'technical' | 'brutalist' | 'classic';

/** The small set of choices a whole theme expands from. */
export interface ThemeSeed {
  name: string;
  /** OKLCH hue, 0–360. */
  hue: number;
  /** 0–1, low → high colourfulness. */
  chroma: number;
  neutral: NeutralTemperature;
  /** 0–1, sharp → soft. 1 is a soft corner, never a pill. */
  radius: number;
  /** 0–1, compact → airy. */
  density: number;
  /** 0–1, borders → shadows. */
  separation: number;
  typePair: TypePairId;
  /** Modular type scale ratio, 1.125–1.333. */
  typeRatio: number;
  motion: MotionLevel;
}

export const NEUTRAL_TEMPERATURES = ['cool', 'neutral', 'warm'] as const satisfies readonly NeutralTemperature[];
export const MOTION_LEVELS = ['none', 'subtle', 'expressive'] as const satisfies readonly MotionLevel[];

export const SEED_LIMITS = {
  hue: [0, 360],
  chroma: [0, 1],
  radius: [0, 1],
  density: [0, 1],
  separation: [0, 1],
  typeRatio: [1.125, 1.333],
} as const satisfies Record<string, readonly [number, number]>;

export type NumericSeedKey = keyof typeof SEED_LIMITS;
