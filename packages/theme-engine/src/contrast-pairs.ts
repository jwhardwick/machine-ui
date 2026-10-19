import type { ColorRole } from '@machine-ui/tokens';
import { apcaContrast, wcagContrast } from './color/contrast.ts';
import type { Oklch } from './color/oklch.ts';

export type Palette = Record<ColorRole, Oklch>;

export interface ContrastPair {
  fg: ColorRole;
  bg: ColorRole;
  /** WCAG 2.2: 4.5:1 for body text, 3:1 for UI component boundaries. */
  target: 4.5 | 3;
  kind: 'text' | 'ui';
}

const text = (fg: ColorRole, bg: ColorRole): ContrastPair => ({ fg, bg, target: 4.5, kind: 'text' });
const ui = (fg: ColorRole, bg: ColorRole): ContrastPair => ({ fg, bg, target: 3, kind: 'ui' });

/**
 * Every pair the components rely on. Order matters when solving: a role is settled as a
 * foreground before it is used as a background for its own "-foreground" partner.
 */
export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  text('foreground', 'background'),
  text('card-foreground', 'card'),
  text('popover-foreground', 'popover'),
  ui('primary', 'background'),
  ui('primary', 'card'),
  text('primary-foreground', 'primary'),
  text('secondary-foreground', 'secondary'),
  text('muted-foreground', 'muted'),
  text('muted-foreground', 'background'),
  text('muted-foreground', 'card'),
  text('accent-foreground', 'accent'),
  text('destructive', 'background'),
  text('destructive', 'card'),
  text('destructive-foreground', 'destructive'),
  ui('input', 'background'),
  ui('input', 'card'),
  ui('ring', 'background'),
  ui('ring', 'card'),
];

export interface PairResult extends ContrastPair {
  ratio: number;
  /** APCA Lc, advisory only. */
  apca: number;
  pass: boolean;
}

export function auditPalette(palette: Palette): PairResult[] {
  return CONTRAST_PAIRS.map((pair) => {
    const ratio = wcagContrast(palette[pair.fg], palette[pair.bg]);
    return {
      ...pair,
      ratio,
      apca: apcaContrast(palette[pair.fg], palette[pair.bg]),
      pass: ratio >= pair.target,
    };
  });
}
