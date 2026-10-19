import type { ThemeSeed } from '@machine-ui/tokens';
import { round } from './color/oklch.ts';
import type { Mode } from './palette.ts';

const r = (value: number) => `${round(value, 3)}rem`;

/** Corner radii. `radius: 1` tops out at a 1rem base corner, never a pill. */
export function corners(seed: ThemeSeed) {
  const md = seed.radius;
  return {
    radius: r(md),
    'corner-sm': r(md * 0.5),
    'corner-md': r(md),
    'corner-lg': r(md * 1.5),
    'corner-xl': r(md * 2),
  };
}

/** Spacing unit and control heights from density. */
export function density(seed: ThemeSeed) {
  const unit = 0.2 + seed.density * 0.1;
  return {
    'space-unit': r(unit),
    'control-sm': r(unit * 7),
    'control-md': r(unit * 9),
    'control-lg': r(unit * 11),
  };
}

/** Low separation draws surfaces with borders; high separation lifts them with shadows. */
export function separation(seed: ThemeSeed) {
  return {
    'border-width': '1px',
    'card-border-width': seed.separation < 0.5 ? '1px' : '0px',
  };
}

export function elevation(seed: ThemeSeed, mode: Mode) {
  if (seed.separation < 0.5) {
    return { 'elevation-sm': 'none', 'elevation-md': 'none', 'elevation-lg': 'none' };
  }
  const strength = (0.06 + (seed.separation - 0.5) * 0.16) * (mode === 'dark' ? 2.5 : 1);
  const shade = (alpha: number) => `oklch(0 0 0 / ${round(Math.min(alpha, 0.9), 3)})`;
  return {
    'elevation-sm': `0 1px 2px ${shade(strength)}`,
    'elevation-md': `0 1px 3px ${shade(strength)}, 0 4px 12px -2px ${shade(strength * 1.4)}`,
    'elevation-lg': `0 2px 6px ${shade(strength)}, 0 16px 40px -8px ${shade(strength * 1.8)}`,
  };
}
