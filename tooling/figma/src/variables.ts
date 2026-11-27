import { generateTheme } from '@machine-ui/theme-engine';
import { COLOR_ROLES, REFERENCE_THEMES, TYPE_STEPS, type ThemeSeed, type ThemeTokens } from '@machine-ui/tokens';
import { converter, parse } from 'culori';
import type { CollectionDef, Rgba, Scope, VariableDef, VariablesDoc } from './schema.ts';

/**
 * Two collections, so a frame can switch theme and mode independently:
 *
 * - `machine-ui/Theme`, one mode per reference theme. Holds every theme-dependent value: both light
 *   and dark colours (hidden from pickers), corners, spacing, type sizes and typefaces.
 * - `machine-ui/Color`, modes Light and Dark. Each role aliases the Theme collection's light or dark
 *   value. Components bind here, so picking a Theme mode and a Color mode on a frame re-themes it.
 *
 * The split keeps each collection small: 6 modes and 2 modes, rather than 12 in one.
 */
export const THEME_COLLECTION = 'machine-ui/Theme';
export const COLOR_COLLECTION = 'machine-ui/Color';

/** Viewport width the fluid type sizes are evaluated at. The extractor measures at the same width. */
export const MEASURE_VIEWPORT = 1280;
const ROOT_PX = 16;

/** Spacing multiples worth a variable: Tailwind's `p-4` is `calc(var(--space-unit) * 4)`. */
export const SPACE_STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16] as const;

/** Figma rejects `.` (and `$`, `{`, `}`) in variable names, so `p-1.5` becomes `space/1_5`. */
export const spaceVariableName = (n: number) => `space/${String(n).replace('.', '_')}`;

/** Characters Figma refuses in a variable name. */
export const INVALID_NAME_CHARS = /[.${}]/;

const toRgb = converter('rgb');

export function cssColorToRgba(css: string): Rgba {
  const parsed = parse(css);
  if (!parsed) throw new Error(`Unparseable colour: ${css}`);
  const { r, g, b, alpha } = toRgb(parsed);
  const clip = (v: number) => round(Math.min(1, Math.max(0, v)), 4);
  return { r: clip(r), g: clip(g), b: clip(b), a: clip(alpha ?? 1) };
}

/** `0.85rem`, `12px`, `0px` or `clamp(min, a + b vw, max)` → px. */
export function cssLengthToPx(css: string, viewport = MEASURE_VIEWPORT): number {
  const value = css.trim();
  const clamp = /^clamp\((.+),(.+),(.+)\)$/.exec(value);
  if (clamp) {
    const [min, preferred, max] = clamp.slice(1).map((s) => s.trim()) as [string, string, string];
    const pref = preferred
      .split('+')
      .map((term) => cssLengthToPx(term, viewport))
      .reduce((a, b) => a + b, 0);
    return round(Math.min(cssLengthToPx(max, viewport), Math.max(cssLengthToPx(min, viewport), pref)), 2);
  }
  const m = /^(-?[\d.]+)(rem|px|vw)?$/.exec(value);
  if (!m) throw new Error(`Unsupported length: ${css}`);
  const n = Number(m[1]);
  if (m[2] === 'rem') return round(n * ROOT_PX, 2);
  if (m[2] === 'vw') return round((n * viewport) / 100, 2);
  return n;
}

/** The first family in a font stack: what Figma can actually load. */
export function primaryFamily(stack: string): string {
  return stack.split(',')[0]!.trim().replace(/^["']|["']$/g, '');
}

const THEME_SCOPES = { color: [] as Scope[] };

const COLOR_SCOPES: Record<string, Scope[]> = {
  foreground: ['TEXT_FILL', 'SHAPE_FILL', 'STROKE_COLOR'],
  border: ['STROKE_COLOR'],
  input: ['STROKE_COLOR'],
  ring: ['STROKE_COLOR', 'EFFECT_COLOR'],
};

function colorScopes(role: string): Scope[] {
  if (role.endsWith('-foreground') || role === 'foreground' || role === 'link') return COLOR_SCOPES.foreground!;
  return COLOR_SCOPES[role] ?? ['ALL_FILLS', 'STROKE_COLOR', 'EFFECT_COLOR'];
}

/** `muted-foreground` → `muted/foreground`, `chart-1` → `chart/1`; plain roles stay as they are. */
export function colorVariableName(role: string): string {
  if (role.endsWith('-foreground') && role !== 'foreground') return `${role.slice(0, -'-foreground'.length)}/foreground`;
  if (role.startsWith('chart-')) return `chart/${role.slice('chart-'.length)}`;
  return role;
}

export function buildVariables(seeds: readonly ThemeSeed[] = REFERENCE_THEMES): VariablesDoc {
  const themes: ThemeTokens[] = seeds.map((seed) => generateTheme(seed));
  const modes = themes.map((t) => t.seed.name);
  const perTheme = (pick: (t: ThemeTokens) => VariableDef['values'][string]) =>
    Object.fromEntries(themes.map((t) => [t.seed.name, pick(t)]));

  const themeVars: VariableDef[] = [];

  for (const mode of ['light', 'dark'] as const) {
    for (const role of COLOR_ROLES) {
      themeVars.push({
        name: `${mode}/${role}`,
        type: 'COLOR',
        scopes: THEME_SCOPES.color,
        values: perTheme((t) => ({ kind: 'color', value: cssColorToRgba(t[mode][role]) })),
      });
    }
  }

  const length = (name: string, token: keyof ThemeTokens['shared'], scopes: Scope[], description?: string) =>
    themeVars.push({
      name,
      type: 'FLOAT',
      scopes,
      ...(description ? { description } : {}),
      values: perTheme((t) => ({ kind: 'number', value: cssLengthToPx(t.shared[token]) })),
    });

  length('radius', 'radius', ['CORNER_RADIUS']);
  for (const step of ['sm', 'md', 'lg', 'xl'] as const) length(`corner/${step}`, `corner-${step}`, ['CORNER_RADIUS']);
  for (const step of ['sm', 'md', 'lg'] as const) length(`control/${step}`, `control-${step}`, ['WIDTH_HEIGHT']);
  length('border/width', 'border-width', ['STROKE_FLOAT']);
  length('border/card', 'card-border-width', ['STROKE_FLOAT']);
  for (const step of TYPE_STEPS) {
    length(`type/${step}`, `type-${step}`, ['FONT_SIZE'], `Fluid in code; evaluated at a ${MEASURE_VIEWPORT}px viewport.`);
  }
  for (const n of SPACE_STEPS) {
    themeVars.push({
      name: spaceVariableName(n),
      type: 'FLOAT',
      scopes: ['GAP', 'WIDTH_HEIGHT'],
      values: perTheme((t) => ({ kind: 'number', value: round(cssLengthToPx(t.shared['space-unit']) * n, 2) })),
    });
  }
  for (const face of ['display', 'text', 'code'] as const) {
    themeVars.push({
      name: `font/${face}`,
      type: 'STRING',
      scopes: ['FONT_FAMILY'],
      values: perTheme((t) => ({ kind: 'string', value: primaryFamily(t.shared[`typeface-${face}`]) })),
    });
  }

  const theme: CollectionDef = { name: THEME_COLLECTION, modes, variables: themeVars };

  const color: CollectionDef = {
    name: COLOR_COLLECTION,
    modes: ['Light', 'Dark'],
    variables: COLOR_ROLES.map((role) => ({
      name: colorVariableName(role),
      type: 'COLOR',
      scopes: colorScopes(role),
      values: {
        Light: { kind: 'alias', collection: THEME_COLLECTION, name: `light/${role}` },
        Dark: { kind: 'alias', collection: THEME_COLLECTION, name: `dark/${role}` },
      },
    })),
  };

  return { collections: [theme, color] };
}

function round(value: number, places: number): number {
  const f = 10 ** places;
  return Math.round(value * f) / f;
}
