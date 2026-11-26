// Turns rendered DOM into the Figma importer's scene JSON. Runs in a real browser (Vitest browser
// mode), so it reads computed styles and measured boxes rather than guessing from class names.
//
// Tokens are recovered by value: before walking, `buildProbes` resolves every colour role and
// length token in the active theme, and each measured value is matched back to a token name. Class
// names only break ties, e.g. `card-foreground` and `foreground` resolving to the same colour.

import { colorVariableName, cssColorToRgba, SPACE_STEPS, spaceVariableName } from '@machine-ui/figma/variables';
import { COLOR_ROLES, TYPE_STEPS } from '@machine-ui/tokens';
import type { FrameNode, Num, Paint, Rgba, SceneNode, Shadow, TextNode, VectorNode } from '@machine-ui/figma/schema';

export interface Probes {
  colors: { role: string; rgba: Rgba }[];
  /** Theme-collection variable name → px. */
  lengths: { corner: Map<string, number>; space: Map<string, number>; type: Map<string, number> };
  /** First font family → Theme-collection variable name. */
  families: Map<string, string>;
}

const firstFamily = (stack: string) => stack.split(',')[0]!.trim().replace(/^["']|["']$/g, '');

/** Resolve every token in `scope`'s theme by rendering a throwaway element that uses it. */
export function buildProbes(scope: HTMLElement): Probes {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  scope.appendChild(probe);
  const resolve = (prop: 'color' | 'width' | 'fontFamily', value: string) => {
    probe.style[prop] = value;
    const cs = getComputedStyle(probe);
    return prop === 'width' ? cs.width : prop === 'color' ? cs.color : cs.fontFamily;
  };
  const px = (v: string) => parseFloat(resolve('width', v));

  const colors = COLOR_ROLES.map((role) => ({ role, rgba: cssColorToRgba(resolve('color', `var(--${role})`)) }));
  const corner = new Map<string, number>();
  for (const s of ['sm', 'md', 'lg', 'xl']) corner.set(`corner/${s}`, px(`var(--corner-${s})`));
  const space = new Map<string, number>();
  for (const n of SPACE_STEPS) space.set(spaceVariableName(n), px(`calc(var(--space-unit) * ${n})`));
  const type = new Map<string, number>();
  for (const s of TYPE_STEPS) type.set(`type/${s}`, px(`var(--type-${s})`));
  const families = new Map<string, string>();
  for (const face of ['text', 'display', 'code']) families.set(firstFamily(resolve('fontFamily', `var(--typeface-${face})`)), `font/${face}`);

  probe.remove();
  return { colors, lengths: { corner, space, type }, families };
}

// ---- Token matching ----

const COLOR_PROPS = { fill: 'bg', text: 'text', stroke: 'border' } as const;
type ColorUse = keyof typeof COLOR_PROPS;

const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;
const sameRgb = (a: Rgba, b: Rgba) => near(a.r, b.r, 0.006) && near(a.g, b.g, 0.006) && near(a.b, b.b, 0.006);

/** Roles named by `bg-x` / `text-x` / `border-x` classes on the element (or, for text, its ancestors). */
function hintedRoles(el: Element | null, use: ColorUse): string[] {
  const prefix = COLOR_PROPS[use];
  const out: string[] = [];
  for (let node = el; node && node instanceof HTMLElement; node = node.parentElement) {
    for (const cls of node.classList) {
      if (cls.includes(':')) continue;
      const m = new RegExp(`^${prefix}-([a-z0-9-]+?)(?:/\\d+)?$`).exec(cls);
      if (m && (COLOR_ROLES as readonly string[]).includes(m[1]!)) out.push(m[1]!);
    }
    if (use !== 'text') break;
  }
  return out;
}

function matchColor(css: string, probes: Probes, el: Element | null, use: ColorUse): Paint | undefined {
  const rgba = cssColorToRgba(css);
  if (rgba.a === 0) return undefined;
  const candidates = probes.colors.filter((c) => sameRgb(c.rgba, rgba)).map((c) => c.role);
  if (candidates.length === 0) return { color: rgba };
  const hinted = hintedRoles(el, use).find((r) => candidates.includes(r));
  const isFg = (r: string) => r.endsWith('foreground') || r === 'link';
  const preferred =
    hinted ??
    (use === 'text' ? candidates.find(isFg) : use === 'stroke' ? candidates.find((r) => r === 'border' || r === 'input') : candidates.find((r) => !isFg(r))) ??
    candidates[0]!;
  return { color: rgba, token: colorVariableName(preferred) };
}

function matchLength(value: number, table: Map<string, number>): Num {
  const v = round(value);
  if (v === 0) return { value: 0 };
  for (const [name, px] of table) if (near(px, v, 0.05)) return { value: v, token: name };
  return { value: v };
}

// ---- Style readers ----

const round = (n: number) => Math.round(n * 100) / 100;
const pxOf = (v: string) => (v === 'normal' || v === 'auto' || v === '' ? 0 : parseFloat(v) || 0);

function readFill(el: Element, cs: CSSStyleDeclaration, probes: Probes): Paint | undefined {
  return matchColor(cs.backgroundColor, probes, el, 'fill');
}

function readStroke(el: Element, cs: CSSStyleDeclaration, probes: Probes): FrameNode['stroke'] {
  const sides = ['Top', 'Right', 'Bottom', 'Left'] as const;
  const weights = sides.map((s) => (cs[`border${s}Style`] === 'none' ? 0 : pxOf(cs[`border${s}Width`]))) as [number, number, number, number];
  const first = sides.findIndex((_, i) => weights[i]! > 0);
  if (first < 0) return undefined;
  const paint = matchColor(cs[`border${sides[first]!}Color`], probes, el, 'stroke');
  return paint ? { paint, weights } : undefined;
}

function readRadius(cs: CSSStyleDeclaration, probes: Probes): FrameNode['radius'] {
  const corners = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(pxOf);
  if (corners.every((c) => c === 0)) return undefined;
  return corners.map((c) => matchLength(c, probes.lengths.corner)) as FrameNode['radius'];
}

/** Split a computed box-shadow list on top-level commas. */
function splitTopLevel(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ',' && depth === 0) {
      out.push(value.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(value.slice(start).trim());
  return out.filter(Boolean);
}

export function readShadows(value: string): Shadow[] | undefined {
  if (!value || value === 'none') return undefined;
  const shadows = splitTopLevel(value).flatMap((part): Shadow[] => {
    const color = /(?:rgba?|oklch|oklab|lab|lch|hsla?|color)\([^)]*\)|#[0-9a-f]{3,8}|transparent/i.exec(part)?.[0];
    if (!color) return [];
    const rest = part.replace(color, ' ');
    const lengths = rest.match(/-?[\d.]+px|\b0\b/g)?.map(pxOf) ?? [];
    const rgba = cssColorToRgba(color);
    if (rgba.a === 0) return [];
    return [{ color: rgba, x: lengths[0] ?? 0, y: lengths[1] ?? 0, blur: lengths[2] ?? 0, spread: lengths[3] ?? 0, inset: /\binset\b/.test(rest) }];
  });
  return shadows.length ? shadows : undefined;
}

const MAIN: Record<string, NonNullable<FrameNode['layout']>['main']> = {
  center: 'CENTER',
  'flex-end': 'MAX',
  end: 'MAX',
  'space-between': 'SPACE_BETWEEN',
};
const CROSS: Record<string, NonNullable<FrameNode['layout']>['cross']> = {
  center: 'CENTER',
  'flex-end': 'MAX',
  end: 'MAX',
  baseline: 'BASELINE',
  'flex-start': 'MIN',
  start: 'MIN',
};

function padding(cs: CSSStyleDeclaration, probes: Probes): [Num, Num, Num, Num] {
  return [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map((p) => matchLength(pxOf(p), probes.lengths.space)) as [Num, Num, Num, Num];
}

const isFlex = (cs: CSSStyleDeclaration) => cs.display === 'flex' || cs.display === 'inline-flex';

function flexLayout(cs: CSSStyleDeclaration, probes: Probes): NonNullable<FrameNode['layout']> {
  const row = cs.flexDirection.startsWith('row');
  const wrap = cs.flexWrap === 'wrap';
  return {
    direction: row ? 'HORIZONTAL' : 'VERTICAL',
    wrap,
    gap: matchLength(pxOf(row ? cs.columnGap : cs.rowGap), probes.lengths.space),
    ...(wrap ? { rowGap: matchLength(pxOf(row ? cs.rowGap : cs.columnGap), probes.lengths.space) } : {}),
    padding: padding(cs, probes),
    main: MAIN[cs.justifyContent] ?? 'MIN',
    cross: CROSS[cs.alignItems] ?? 'STRETCH',
  };
}

// ---- Walking ----

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

const rel = (r: DOMRect, parent: DOMRect | null): Box => ({
  x: round(parent ? r.left - parent.left : 0),
  y: round(parent ? r.top - parent.top : 0),
  width: round(r.width),
  height: round(r.height),
});

const slotName = (el: Element) => (el as HTMLElement).dataset?.slot ?? el.tagName.toLowerCase();

function hasBox(cs: CSSStyleDeclaration): boolean {
  return (
    cssColorToRgba(cs.backgroundColor).a > 0 ||
    ['Top', 'Right', 'Bottom', 'Left'].some((s) => cs.getPropertyValue(`border-${s.toLowerCase()}-style`) !== 'none' && pxOf(cs.getPropertyValue(`border-${s.toLowerCase()}-width`)) > 0) ||
    cs.boxShadow !== 'none' ||
    ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].some((p) => pxOf(cs[p as 'paddingTop']) > 0)
  );
}

const INLINE_TEXT = new Set(['SPAN', 'STRONG', 'EM', 'B', 'I', 'A', 'CODE', 'KBD', 'SMALL', 'MARK', 'ABBR']);

/** An element whose content is only text and plain inline elements: it becomes one text layer. */
function isTextLeaf(el: Element): boolean {
  if (!el.textContent?.trim()) return false;
  return [...el.childNodes].every(
    (n) => n.nodeType === Node.TEXT_NODE || (n instanceof HTMLElement && INLINE_TEXT.has(n.tagName) && !hasBox(getComputedStyle(n)) && isTextLeafOrEmpty(n)),
  );
}
const isTextLeafOrEmpty = (el: Element) => [...el.childNodes].every((n) => n.nodeType === Node.TEXT_NODE || (n instanceof Element && isTextLeaf(n)));

function visible(el: Element): boolean {
  const cs = getComputedStyle(el);
  if (cs.display === 'none' || cs.visibility === 'hidden') return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 || r.height > 0;
}

const WEIGHTS: Record<string, number> = { normal: 400, bold: 700 };

function textNode(
  name: string,
  characters: string,
  styleEl: Element,
  box: Box,
  probes: Probes,
  colorCss?: string,
): TextNode {
  const cs = getComputedStyle(styleEl);
  const fontSize = pxOf(cs.fontSize);
  const lineHeight = cs.lineHeight === 'normal' ? round(fontSize * 1.2) : pxOf(cs.lineHeight);
  const family = firstFamily(cs.fontFamily);
  const familyToken = probes.families.get(family);
  const align = cs.textAlign === 'center' ? 'CENTER' : cs.textAlign === 'right' || cs.textAlign === 'end' ? 'RIGHT' : cs.textAlign === 'justify' ? 'JUSTIFIED' : 'LEFT';
  const deco = cs.textDecorationLine.includes('underline') ? 'UNDERLINE' : cs.textDecorationLine.includes('line-through') ? 'STRIKETHROUGH' : 'NONE';
  const transform = { uppercase: 'UPPER', lowercase: 'LOWER', capitalize: 'TITLE' }[cs.textTransform] as TextNode['case'] | undefined;
  const color = matchColor(colorCss ?? cs.color, probes, styleEl, 'text') ?? { color: cssColorToRgba(cs.color) };
  return {
    type: 'text',
    name,
    ...box,
    characters,
    font: { family, ...(familyToken ? { familyToken } : {}), weight: WEIGHTS[cs.fontWeight] ?? (Number(cs.fontWeight) || 400), italic: cs.fontStyle === 'italic' },
    size: matchLength(fontSize, probes.lengths.type),
    lineHeight,
    letterSpacing: pxOf(cs.letterSpacing),
    color,
    align,
    decoration: deco,
    case: transform ?? 'ORIGINAL',
    wraps: box.height > lineHeight * 1.5 && cs.whiteSpace !== 'nowrap',
  };
}

const collapse = (s: string) => s.replace(/\s+/g, ' ').trim();

function vectorNode(svg: SVGSVGElement, parentRect: DOMRect, probes: Probes): VectorNode {
  const r = svg.getBoundingClientRect();
  const cs = getComputedStyle(svg);
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const color = matchColor(cs.color, probes, svg, 'text');
  const hex = rgbaToCss(cssColorToRgba(cs.color));
  clone.setAttribute('width', String(round(r.width)));
  clone.setAttribute('height', String(round(r.height)));
  clone.removeAttribute('class');
  for (const node of [clone, ...clone.querySelectorAll('*')]) {
    for (const attr of ['stroke', 'fill']) if (node.getAttribute(attr) === 'currentColor') node.setAttribute(attr, hex);
  }
  // Lucide sets stroke on the root; make sure computed values that came from CSS survive.
  if (!clone.getAttribute('stroke') && cs.stroke && cs.stroke !== 'none') clone.setAttribute('stroke', rgbaToCss(cssColorToRgba(cs.stroke === 'currentcolor' ? cs.color : cs.stroke)));
  const name = [...svg.classList].find((c) => c.startsWith('lucide-'))?.slice('lucide-'.length) ?? 'icon';
  return {
    type: 'vector',
    name,
    ...rel(r, parentRect),
    svg: new XMLSerializer().serializeToString(clone),
    ...(color ? { color } : {}),
  };
}

function rgbaToCss({ r, g, b, a }: Rgba): string {
  const h = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return a < 1 ? `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})` : `#${h(r)}${h(g)}${h(b)}`;
}

/** Whether the element keeps its size when allowed to shrink to content on one axis. */
function hugs(el: HTMLElement, axis: 'width' | 'height'): boolean {
  const before = el.getBoundingClientRect()[axis];
  const prev = el.style.getPropertyValue(axis);
  const prevPriority = el.style.getPropertyPriority(axis);
  const prevMin = el.style.getPropertyValue(`min-${axis}`);
  el.style.setProperty(axis, axis === 'width' ? 'max-content' : 'auto', 'important');
  el.style.setProperty(`min-${axis}`, '0', 'important');
  const after = el.getBoundingClientRect()[axis];
  el.style.setProperty(axis, prev, prevPriority);
  el.style.setProperty(`min-${axis}`, prevMin);
  return Math.abs(after - before) < 0.5;
}

type Child = { kind: 'el'; el: Element } | { kind: 'text'; node: Text };

function flowChildren(el: Element): Child[] {
  const out: Child[] = [];
  for (const n of el.childNodes) {
    if (n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) out.push({ kind: 'text', node: n as Text });
    else if (n instanceof Element && visible(n)) out.push({ kind: 'el', el: n });
  }
  return out;
}

/**
 * Infer a stack layout for a non-flex element whose children sit in one column (or one row) with
 * a constant gap. Block flow and simple grids become auto layout this way; anything else stays
 * absolutely positioned.
 */
function inferStack(el: Element, children: Box[], cs: CSSStyleDeclaration): { direction: 'VERTICAL' | 'HORIZONTAL'; gap: number } | undefined {
  if (children.length === 0) return undefined;
  const padL = pxOf(cs.paddingLeft) + pxOf(cs.borderLeftWidth);
  const padT = pxOf(cs.paddingTop) + pxOf(cs.borderTopWidth);
  const tryAxis = (direction: 'VERTICAL' | 'HORIZONTAL') => {
    const [pos, size, crossPos, start] = direction === 'VERTICAL' ? (['y', 'height', 'x', padL] as const) : (['x', 'width', 'y', padT] as const);
    const gaps: number[] = [];
    for (let i = 1; i < children.length; i++) gaps.push(round(children[i]![pos] - children[i - 1]![pos] - children[i - 1]![size]));
    if (gaps.some((g) => g < -0.5 || Math.abs(g - (gaps[0] ?? 0)) > 0.5)) return undefined;
    if (direction === 'VERTICAL' && children.some((c) => Math.abs(c[crossPos] - start) > 0.5)) return undefined;
    return { direction, gap: Math.max(0, gaps[0] ?? 0) };
  };
  void el;
  return tryAxis('VERTICAL') ?? (children.length > 1 ? tryAxis('HORIZONTAL') : undefined);
}

export function walk(el: HTMLElement, probes: Probes, parentRect: DOMRect | null = null): SceneNode {
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const box = rel(rect, parentRect);
  const name = slotName(el);

  if (el instanceof SVGSVGElement) return vectorNode(el, parentRect ?? rect, probes);

  const frame: FrameNode = {
    type: 'frame',
    name,
    ...box,
    children: [],
  };
  const fill = readFill(el, cs, probes);
  if (fill) frame.fill = fill;
  const stroke = readStroke(el, cs, probes);
  if (stroke) frame.stroke = stroke;
  const radius = readRadius(cs, probes);
  if (radius) frame.radius = radius;
  const shadows = readShadows(cs.boxShadow);
  if (shadows) frame.shadows = shadows;
  if (Number(cs.opacity) < 1) frame.opacity = Number(cs.opacity);
  if (cs.overflow !== 'visible' && cs.overflow !== '') frame.clips = true;

  const contentBox = (): Box => {
    const l = pxOf(cs.borderLeftWidth) + pxOf(cs.paddingLeft);
    const t = pxOf(cs.borderTopWidth) + pxOf(cs.paddingTop);
    return {
      x: round(l),
      y: round(t),
      width: round(rect.width - l - pxOf(cs.borderRightWidth) - pxOf(cs.paddingRight)),
      height: round(rect.height - t - pxOf(cs.borderBottomWidth) - pxOf(cs.paddingBottom)),
    };
  };

  // Form fields: the value or placeholder isn't a DOM node, so make one.
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    const placeholder = !el.value;
    const characters = el.value || el.placeholder;
    const content = contentBox();
    frame.layout = {
      direction: 'HORIZONTAL',
      wrap: false,
      gap: { value: 0 },
      padding: padding(cs, probes),
      main: 'MIN',
      cross: el instanceof HTMLTextAreaElement ? 'MIN' : 'CENTER',
    };
    if (characters) {
      const colorCss = placeholder ? getComputedStyle(el, '::placeholder').color : undefined;
      const lh = cs.lineHeight === 'normal' ? pxOf(cs.fontSize) * 1.2 : pxOf(cs.lineHeight);
      const text = textNode(placeholder ? 'placeholder' : 'value', characters, el, { x: content.x, y: round(content.y + (content.height - lh) / 2), width: content.width, height: round(lh) }, probes, colorCss);
      text.wraps = false;
      text.sizing = { horizontal: 'FILL', vertical: 'HUG' };
      frame.children.push(text);
    }
    return frame;
  }

  // Text-only element with no box of its own: just a text layer.
  if (isTextLeaf(el)) {
    const characters = collapse(el.textContent ?? '');
    if (!hasBox(cs)) return textNode(name, characters, el, box, probes);
    const range = document.createRange();
    range.selectNodeContents(el);
    const text = textNode('label', characters, el, rel(range.getBoundingClientRect(), rect), probes);
    frame.layout = isFlex(cs)
      ? flexLayout(cs, probes)
      : { direction: 'VERTICAL', wrap: false, gap: { value: 0 }, padding: padding(cs, probes), main: 'MIN', cross: 'MIN' };
    text.sizing = { horizontal: text.wraps ? 'FILL' : 'HUG', vertical: 'HUG' };
    if (frame.layout.cross === 'STRETCH') frame.layout.cross = 'MIN';
    frame.children.push(text);
    return frame;
  }

  const children = flowChildren(el);
  const nodes: SceneNode[] = [];
  const outOfFlow = new Set<SceneNode>();
  for (const child of children) {
    if (child.kind === 'text') {
      const range = document.createRange();
      range.selectNodeContents(child.node);
      const r = range.getBoundingClientRect();
      nodes.push(textNode('text', collapse(child.node.textContent ?? ''), el, rel(r, rect), probes));
      continue;
    }
    const node = walk(child.el as HTMLElement, probes, rect);
    const pos = getComputedStyle(child.el).position;
    if (pos === 'absolute' || pos === 'fixed') {
      node.absolute = true;
      outOfFlow.add(node);
    }
    nodes.push(node);
  }
  frame.children = nodes;
  const inFlow = nodes.filter((n) => !outOfFlow.has(n));

  const flex = isFlex(cs);
  if (flex) {
    frame.layout = flexLayout(cs, probes);
  } else {
    const stack = inferStack(el, inFlow, cs);
    if (stack) {
      frame.layout = {
        direction: stack.direction,
        wrap: false,
        gap: matchLength(stack.gap, probes.lengths.space),
        padding: padding(cs, probes),
        main: 'MIN',
        cross: stack.direction === 'VERTICAL' ? 'STRETCH' : 'MIN',
      };
    }
  }

  if (frame.layout) {
    const content = contentBox();
    const horizontal = frame.layout.direction === 'HORIZONTAL';
    children.forEach((child, i) => {
      const node = nodes[i]!;
      if (outOfFlow.has(node)) return;
      const childEl = child.kind === 'el' ? (child.el as HTMLElement) : null;
      const ccs = childEl ? getComputedStyle(childEl) : null;
      const fillsMain = ccs ? Number(ccs.flexGrow) > 0 && flex : false;
      const crossSize = horizontal ? node.height : node.width;
      const contentCross = horizontal ? content.height : content.width;
      const stretched = frame.layout!.cross === 'STRETCH' && (!ccs || ccs.alignSelf === 'auto' || ccs.alignSelf === 'stretch' || ccs.alignSelf === 'normal');
      const fillsCross = Math.abs(crossSize - contentCross) < 0.5 && (stretched || (childEl ? !hugs(childEl, horizontal ? 'height' : 'width') : false));
      const hugW = node.type === 'text' ? !node.wraps : node.type === 'frame' && childEl ? !!node.layout && hugs(childEl, 'width') : false;
      const hugH = node.type === 'text' ? true : node.type === 'frame' && childEl ? !!node.layout && hugs(childEl, 'height') : false;
      const pick = (fills: boolean, hug: boolean) => (fills ? 'FILL' : hug ? 'HUG' : 'FIXED');
      node.sizing = horizontal
        ? { horizontal: pick(fillsMain, hugW), vertical: pick(fillsCross, hugH) }
        : { horizontal: pick(fillsCross, hugW), vertical: pick(fillsMain, hugH) };
      // A wrapping text layer that fills its column: let the layout set its width.
      if (node.type === 'text' && node.wraps && !horizontal) node.sizing.horizontal = 'FILL';
    });
    // Figma has no "stretch" alignment on the frame itself; children carry FILL instead.
    if (frame.layout.cross === 'STRETCH') frame.layout.cross = 'MIN';
  }

  return frame;
}

/** Root sizing: hug when content-sized, fixed otherwise. */
export function rootSizing(el: HTMLElement, node: SceneNode): void {
  const layout = node.type === 'frame' && !!node.layout;
  node.sizing = {
    horizontal: layout && hugs(el, 'width') ? 'HUG' : 'FIXED',
    vertical: layout && hugs(el, 'height') ? 'HUG' : 'FIXED',
  };
}
