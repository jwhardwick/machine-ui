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
  geist: {
    id: 'geist',
    label: 'Geist',
    display: '"Geist", "Helvetica Neue", Arial, sans-serif',
    text: '"Geist", "Helvetica Neue", Arial, sans-serif',
    code: '"Geist Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery: 'family=Geist:wght@400..700&family=Geist+Mono:wght@400..600',
  },
  civic: {
    id: 'civic',
    label: 'Public Sans',
    display: '"Public Sans", "Helvetica Neue", Arial, sans-serif',
    text: '"Public Sans", "Helvetica Neue", Arial, sans-serif',
    code: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery: 'family=Public+Sans:wght@400..800&family=IBM+Plex+Mono:wght@400;600',
  },
  editorial: {
    id: 'editorial',
    label: 'Instrument Serif + Instrument Sans',
    display: '"Instrument Serif", "Iowan Old Style", Georgia, serif',
    text: '"Instrument Sans", "Helvetica Neue", Arial, sans-serif',
    code: '"JetBrains Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery:
      'family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400..700&family=JetBrains+Mono:wght@400;600',
  },
  technical: {
    id: 'technical',
    label: 'IBM Plex Mono + IBM Plex Sans',
    display: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
    text: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
    code: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery: 'family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700',
  },
  humanist: {
    id: 'humanist',
    label: 'Bricolage Grotesque + Figtree',
    display: '"Bricolage Grotesque", "Trebuchet MS", sans-serif',
    text: '"Figtree", "Trebuchet MS", sans-serif',
    code: '"JetBrains Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery:
      'family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Figtree:wght@400..700&family=JetBrains+Mono:wght@400;600',
  },
  heavy: {
    id: 'heavy',
    label: 'Archivo Black + Archivo',
    display: '"Archivo Black", "Arial Black", sans-serif',
    text: '"Archivo", "Helvetica Neue", Arial, sans-serif',
    code: '"Space Mono", ui-monospace, Menlo, monospace',
    googleFontsQuery: 'family=Archivo+Black&family=Archivo:wght@400..700&family=Space+Mono:wght@400;700',
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
