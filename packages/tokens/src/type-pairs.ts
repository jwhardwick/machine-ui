import type { TypePairId } from './seed.ts';

export interface TypePair {
  id: TypePairId;
  label: string;
  /** Font stacks. Each ends in a generic family so a failed web font still reads well. */
  display: string;
  text: string;
  code: string;
  /** `family=` query for fonts.googleapis.com/css2. */
  googleFontsQuery: string;
}

export const TYPE_PAIRS: Record<TypePairId, TypePair> = {
  editorial: {
    id: 'editorial',
    label: 'Editorial: Fraunces + Source Serif 4',
    display: '"Fraunces", "Iowan Old Style", Georgia, serif',
    text: '"Source Serif 4", "Iowan Old Style", Georgia, serif',
    code: '"JetBrains Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery:
      'family=Fraunces:opsz,wght@9..144,400..800&family=Source+Serif+4:opsz,wght@8..60,400..700&family=JetBrains+Mono:wght@400;600',
  },
  grotesk: {
    id: 'grotesk',
    label: 'Grotesk: Space Grotesk + IBM Plex Sans',
    display: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif',
    text: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
    code: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery:
      'family=Space+Grotesk:wght@400..700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600',
  },
  humanist: {
    id: 'humanist',
    label: 'Humanist: Bricolage Grotesque + Atkinson Hyperlegible',
    display: '"Bricolage Grotesque", "Trebuchet MS", sans-serif',
    text: '"Atkinson Hyperlegible", Verdana, sans-serif',
    code: '"JetBrains Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery:
      'family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Atkinson+Hyperlegible:wght@400;700&family=JetBrains+Mono:wght@400;600',
  },
  technical: {
    id: 'technical',
    label: 'Technical: IBM Plex Mono + IBM Plex Sans',
    display: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
    text: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
    code: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery: 'family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700',
  },
  brutalist: {
    id: 'brutalist',
    label: 'Brutalist: Archivo Black + Archivo',
    display: '"Archivo Black", "Arial Black", sans-serif',
    text: '"Archivo", "Helvetica Neue", Arial, sans-serif',
    code: '"Space Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery: 'family=Archivo+Black&family=Archivo:wght@400..700&family=Space+Mono:wght@400;700',
  },
  classic: {
    id: 'classic',
    label: 'Classic: DM Serif Display + DM Sans',
    display: '"DM Serif Display", Georgia, serif',
    text: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    code: '"DM Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery: 'family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,400..700&family=DM+Mono:wght@400;500',
  },
};

export const TYPE_PAIR_IDS = Object.keys(TYPE_PAIRS) as TypePairId[];

/** Every family named in a curated pair, for lint ban lists. */
export const CURATED_FONT_FAMILIES = [
  ...new Set(
    Object.values(TYPE_PAIRS).flatMap((pair) =>
      [pair.display, pair.text, pair.code].flatMap((stack) =>
        [...stack.matchAll(/"([^"]+)"/g)].map((m) => m[1] as string),
      ),
    ),
  ),
];
