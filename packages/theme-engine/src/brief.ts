import { TYPE_PAIRS, type ThemeSeed } from '@machine-ui/tokens';
import { serializeSeed } from './url.ts';

const NEUTRAL_LINES = {
  cool: 'Cool, blue-grey neutrals',
  neutral: 'True neutral greys',
  warm: 'Warm, paper-like neutrals',
} as const;

function band<T>(value: number, low: T, mid: T, high: T): T {
  return value < 0.25 ? low : value < 0.6 ? mid : high;
}

/** `theme-brief.md`: tells a coding agent how this theme should feel and what not to do. */
export function themeBrief(seed: ThemeSeed): string {
  const pair = TYPE_PAIRS[seed.typePair];
  const bordered = seed.separation < 0.5;
  const sharp = seed.radius < 0.1;

  const personality = [
    `${NEUTRAL_LINES[seed.neutral]}; brand hue ${Math.round(seed.hue)}°, ${band(seed.chroma, 'muted', 'moderate', 'vivid')} colour.`,
    sharp ? 'Sharp corners.' : seed.radius < 0.4 ? 'Slightly rounded corners.' : 'Soft, rounded corners (never pills).',
    bordered ? 'Borders, not shadows: surfaces are separated by 1px lines.' : 'Shadows, not borders: surfaces lift off the page.',
    `${band(seed.density, 'Compact', 'Balanced', 'Airy')} density.`,
    `Type: ${pair.label}. Display face for headings only; scale ratio ${seed.typeRatio}.`,
    `Motion: ${seed.motion}.`,
  ];

  const dont = [
    'No gradients.',
    'No raw colours, pixel values or font names: use semantic tokens.',
    bordered ? "Don't add shadows to cards, inputs or popovers." : "Don't outline cards with borders; let elevation separate them.",
    sharp ? "Don't round corners." : 'No pill shapes on rectangular controls.',
    ...(seed.motion === 'none' ? ["Don't animate: transitions are off in this theme."] : []),
  ];

  return [
    `# Theme brief: ${seed.name}`,
    '',
    `Seed: \`${serializeSeed(seed)}\``,
    '',
    '## Personality',
    '',
    ...personality.map((line) => `- ${line}`),
    '',
    '## Do',
    '',
    '- Use semantic utilities (`bg-primary`, `text-muted-foreground`, `border-border`) or `var(--primary)` directly.',
    '- Pair every surface with its `-foreground` token; the contrast is already solved.',
    '- Use the spacing scale and `--control-*` heights rather than ad-hoc sizes.',
    '',
    "## Don't",
    '',
    ...dont.map((line) => `- ${line}`),
    '',
  ].join('\n');
}
