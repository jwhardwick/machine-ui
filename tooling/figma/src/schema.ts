// The JSON the Figma plugin reads. Both halves of the bridge write it: `variables.ts` (tokens) and
// the extractor in apps/storybook/figma (components). Keep it plain data: the plugin sandbox has no
// access to the repo, only to what the build embeds.

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** A value for one mode. `alias` points at a variable in another collection, by collection and name. */
export type VariableValue =
  | { kind: 'color'; value: Rgba }
  | { kind: 'number'; value: number }
  | { kind: 'string'; value: string }
  | { kind: 'alias'; collection: string; name: string };

/** Figma's VariableScope names. An empty list hides the variable from pickers. */
export type Scope =
  | 'ALL_FILLS'
  | 'FRAME_FILL'
  | 'SHAPE_FILL'
  | 'TEXT_FILL'
  | 'STROKE_COLOR'
  | 'EFFECT_COLOR'
  | 'CORNER_RADIUS'
  | 'WIDTH_HEIGHT'
  | 'GAP'
  | 'STROKE_FLOAT'
  | 'FONT_SIZE'
  | 'FONT_FAMILY';

export interface VariableDef {
  /** Slash-separated: Figma shows each segment as a group. */
  name: string;
  type: 'COLOR' | 'FLOAT' | 'STRING';
  scopes: Scope[];
  description?: string;
  /** Mode name → value. Every mode of the collection must be present. */
  values: Record<string, VariableValue>;
}

export interface CollectionDef {
  name: string;
  modes: string[];
  variables: VariableDef[];
}

export interface VariablesDoc {
  collections: CollectionDef[];
}

// ---- Components ----

/** A colour, plus the token it came from when the extractor could tell. */
export interface Paint {
  color: Rgba;
  /** Variable name in the Color collection (`primary`), or undefined for a literal. */
  token?: string;
}

/** A number, plus the Theme-collection variable it matches (`corner/md`, `space/4`). */
export interface Num {
  value: number;
  token?: string;
}

export interface Shadow {
  color: Rgba;
  x: number;
  y: number;
  blur: number;
  spread: number;
  inset: boolean;
}

export interface BaseNode {
  name: string;
  /** Position relative to the parent's border box, in px. */
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  /** How this node sizes inside an auto-layout parent. */
  sizing?: { horizontal: 'FIXED' | 'HUG' | 'FILL'; vertical: 'FIXED' | 'HUG' | 'FILL' };
  /** Taken out of the parent's auto layout and placed at x/y. */
  absolute?: boolean;
}

export interface FrameNode extends BaseNode {
  type: 'frame';
  layout?: {
    direction: 'HORIZONTAL' | 'VERTICAL';
    wrap: boolean;
    gap: Num;
    /** Cross-axis gap when wrapping. */
    rowGap?: Num;
    padding: [Num, Num, Num, Num];
    main: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
    cross: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE' | 'STRETCH';
  };
  fill?: Paint;
  stroke?: { paint: Paint; weights: [number, number, number, number]; token?: string };
  radius?: [Num, Num, Num, Num];
  shadows?: Shadow[];
  clips?: boolean;
  children: SceneNode[];
}

export interface TextNode extends BaseNode {
  type: 'text';
  characters: string;
  font: { family: string; familyToken?: string; weight: number; italic: boolean };
  size: Num;
  /** px. */
  lineHeight: number;
  letterSpacing: number;
  color: Paint;
  align: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  decoration: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
  case: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
  /** One line that sets its own width, or a fixed width that wraps. */
  wraps: boolean;
}

export interface VectorNode extends BaseNode {
  type: 'vector';
  /** Standalone SVG markup with colours already resolved. */
  svg: string;
  /** Token of the icon's stroke or fill colour, rebound after import. */
  color?: Paint;
}

export type SceneNode = FrameNode | TextNode | VectorNode;

export interface ComponentVariant {
  /** Property name → value, e.g. { variant: 'secondary', size: 'sm' }. */
  props: Record<string, string>;
  root: FrameNode;
}

export interface ComponentDef {
  /** Stable key for re-imports, e.g. `button`. */
  key: string;
  name: string;
  /** Page section it goes under. */
  group: string;
  description?: string;
  variants: ComponentVariant[];
}

export interface ComponentsDoc {
  /** Theme and mode the literals were measured in. Bound variables override them. */
  measuredIn: { theme: string; mode: 'light' | 'dark' };
  components: ComponentDef[];
}
