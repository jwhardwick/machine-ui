import type { MotionLevel } from '@machine-ui/tokens';

const STANDARD = 'cubic-bezier(0.2, 0, 0, 1)';

const LEVELS: Record<MotionLevel, [fast: number, normal: number, slow: number, emphasized: string]> = {
  none: [0, 0, 0, STANDARD],
  subtle: [100, 150, 200, STANDARD],
  expressive: [150, 250, 400, 'cubic-bezier(0.3, 1.4, 0.5, 1)'],
};

export function motion(level: MotionLevel) {
  const [fast, normal, slow, emphasized] = LEVELS[level];
  return {
    'motion-fast': `${fast}ms`,
    'motion-normal': `${normal}ms`,
    'motion-slow': `${slow}ms`,
    'motion-ease-standard': STANDARD,
    'motion-ease-emphasized': emphasized,
  };
}
