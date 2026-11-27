// machine-ui bridge: a Figma development plugin. It syncs the token Variables and builds the
// component library from the JSON that `pnpm figma:build` embeds. Re-running updates what it made
// before (matched by name and plugin data), so instances in your own files keep working.

import data from 'virtual:bridge-data';
import type {
  CollectionDef,
  ComponentDef,
  FrameNode as FrameDef,
  Num,
  Paint as PaintDef,
  SceneNode as NodeDef,
  TextNode as TextDef,
  VectorNode as VectorDef,
} from '../../src/schema.ts';

const KEY = 'machine-ui';
const PAGE_NAME = 'Components';
const COLOR_COLLECTION = 'machine-ui/Color';
const THEME_COLLECTION = 'machine-ui/Theme';

const warnings: string[] = [];

const errorText = (error: unknown) => (error instanceof Error ? error.message : String(error));

// ---- Variables ----

/** Collection name → variable name → Variable. Filled by syncVariables, read when building. */
const vars = new Map<string, Map<string, Variable>>();

async function syncVariables(collections: CollectionDef[]): Promise<void> {
  const existing = await figma.variables.getLocalVariableCollectionsAsync();
  const allVars = await figma.variables.getLocalVariablesAsync();
  const modeIds = new Map<string, Map<string, string>>();
  const pending: { def: CollectionDef['variables'][number]; variable: Variable; collection: string }[] = [];

  for (const def of collections) {
    let collection = existing.find((c) => c.name === def.name);
    if (!collection) {
      collection = figma.variables.createVariableCollection(def.name);
      collection.renameMode(collection.modes[0]!.modeId, def.modes[0]!);
    }
    const modes = new Map(collection.modes.map((m) => [m.name, m.modeId]));
    for (const name of def.modes) {
      if (modes.has(name)) continue;
      try {
        modes.set(name, collection.addMode(name));
      } catch (error) {
        throw new Error(
          `Couldn't add mode "${name}" to ${def.name}: ${String(error)}. Your Figma plan may limit modes per collection; ` +
            `${def.name} needs ${def.modes.length}.`,
          { cause: error },
        );
      }
    }
    modeIds.set(def.name, modes);

    const byName = new Map(allVars.filter((v) => v.variableCollectionId === collection!.id).map((v) => [v.name, v]));
    const map = new Map<string, Variable>();
    for (const v of def.variables) {
      let variable = byName.get(v.name);
      if (variable && variable.resolvedType !== v.type) {
        variable.remove();
        variable = undefined;
      }
      try {
        variable ??= figma.variables.createVariable(v.name, collection, v.type);
        variable.scopes = v.scopes;
        variable.description = v.description ?? '';
        variable.hiddenFromPublishing = v.scopes.length === 0;
      } catch (error) {
        throw new Error(`Variable "${v.name}" in ${def.name}: ${errorText(error)}`, { cause: error });
      }
      map.set(v.name, variable);
      pending.push({ def: v, variable, collection: def.name });
    }
    vars.set(def.name, map);
  }

  // Values go in once every variable exists, so aliases across collections resolve.
  for (const { def, variable, collection } of pending) {
    const modes = modeIds.get(collection)!;
    for (const [mode, value] of Object.entries(def.values)) {
      const modeId = modes.get(mode);
      if (!modeId) continue;
      try {
        if (value.kind === 'alias') {
          const target = vars.get(value.collection)?.get(value.name);
          if (!target) throw new Error(`alias target ${value.collection} / ${value.name} is missing`);
          variable.setValueForMode(modeId, figma.variables.createVariableAlias(target));
        } else {
          variable.setValueForMode(modeId, value.value);
        }
      } catch (error) {
        throw new Error(`Setting "${def.name}" for mode ${mode}: ${errorText(error)}`, { cause: error });
      }
    }
  }
}

async function loadVariables(): Promise<void> {
  if (vars.size) return;
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const all = await figma.variables.getLocalVariablesAsync();
  for (const c of collections) {
    if (c.name !== COLOR_COLLECTION && c.name !== THEME_COLLECTION) continue;
    vars.set(c.name, new Map(all.filter((v) => v.variableCollectionId === c.id).map((v) => [v.name, v])));
  }
  if (!vars.has(COLOR_COLLECTION)) warnings.push('No machine-ui variables in this file yet: components are built with literal values. Run "Sync everything".');
}

const colorVar = (token?: string) => (token ? vars.get(COLOR_COLLECTION)?.get(token) : undefined);
const themeVar = (token?: string) => (token ? vars.get(THEME_COLLECTION)?.get(token) : undefined);

// ---- Fonts ----

const STYLE_BY_WEIGHT: Record<number, string[]> = {
  100: ['thin', 'hairline'],
  200: ['extralight', 'ultralight'],
  300: ['light'],
  400: ['regular', 'normal', 'book'],
  500: ['medium'],
  600: ['semibold', 'demibold'],
  700: ['bold'],
  800: ['extrabold', 'ultrabold'],
  900: ['black', 'heavy'],
};
const FALLBACK: FontName = { family: 'Roboto', style: 'Regular' };

let available: Font[] | undefined;
const fontCache = new Map<string, FontName>();

async function resolveFont(family: string, weight: number, italic: boolean): Promise<FontName> {
  const key = `${family}/${weight}/${italic}`;
  const cached = fontCache.get(key);
  if (cached) return cached;
  available ??= await figma.listAvailableFontsAsync();
  const styles = available.filter((f) => f.fontName.family === family).map((f) => f.fontName);
  let font: FontName = FALLBACK;
  if (styles.length === 0) {
    warnings.push(`Font "${family}" isn't available in Figma; used ${FALLBACK.family}.`);
  } else {
    const norm = (s: string) => s.toLowerCase().replace(/[\s-]/g, '');
    const rounded = Math.min(900, Math.max(100, Math.round(weight / 100) * 100));
    const wanted = STYLE_BY_WEIGHT[rounded]!.map((w) => (italic ? (w === 'regular' ? 'italic' : `${w}italic`) : w));
    font = styles.find((s) => wanted.includes(norm(s.style))) ?? styles.find((s) => norm(s.style) === 'regular') ?? styles[0]!;
  }
  await figma.loadFontAsync(font);
  fontCache.set(key, font);
  return font;
}

/** Fonts are loaded up front because text properties can't be set before their font is. */
async function preloadFonts(node: NodeDef): Promise<void> {
  if (node.type === 'text') await resolveFont(node.font.family, node.font.weight, node.font.italic);
  if (node.type === 'frame') for (const c of node.children) await preloadFonts(c);
}

// ---- Building ----

function solid(p: PaintDef): SolidPaint {
  const paint: SolidPaint = { type: 'SOLID', color: { r: p.color.r, g: p.color.g, b: p.color.b }, opacity: p.color.a };
  const v = colorVar(p.token);
  return v ? figma.variables.setBoundVariableForPaint(paint, 'color', v) : paint;
}

function bindNum(node: SceneNode, field: VariableBindableNodeField, num: Num): void {
  const v = themeVar(num.token);
  if (v) node.setBoundVariable(field, v);
}

/** Style a frame (or component) from its definition, replacing its children. */
function applyFrame(target: FrameNode | ComponentNode, def: FrameDef): void {
  for (const child of [...target.children]) child.remove();
  target.layoutMode = def.layout?.direction ?? 'NONE';
  target.resize(Math.max(0.01, def.width), Math.max(0.01, def.height));
  target.fills = def.fill ? [solid(def.fill)] : [];
  target.opacity = def.opacity ?? 1;
  target.clipsContent = !!def.clips;
  target.effects = (def.shadows ?? []).map(
    (s): DropShadowEffect | InnerShadowEffect => ({
      type: s.inset ? 'INNER_SHADOW' : 'DROP_SHADOW',
      color: s.color,
      offset: { x: s.x, y: s.y },
      radius: s.blur,
      spread: s.spread,
      visible: true,
      blendMode: 'NORMAL',
      ...(s.inset ? {} : { showShadowBehindNode: false }),
    }) as DropShadowEffect | InnerShadowEffect,
  );

  if (def.stroke) {
    target.strokes = [solid(def.stroke.paint)];
    target.strokeAlign = 'INSIDE';
    const [t, r, b, l] = def.stroke.weights;
    target.strokeTopWeight = t;
    target.strokeRightWeight = r;
    target.strokeBottomWeight = b;
    target.strokeLeftWeight = l;
  } else {
    target.strokes = [];
  }

  if (def.radius) {
    const fields = ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'] as const;
    def.radius.forEach((r, i) => {
      target[fields[i]!] = r.value;
      bindNum(target, fields[i]!, r);
    });
  } else {
    target.cornerRadius = 0;
  }

  if (def.layout) {
    const l = def.layout;
    target.layoutWrap = l.wrap && l.direction === 'HORIZONTAL' ? 'WRAP' : 'NO_WRAP';
    target.itemSpacing = l.gap.value;
    bindNum(target, 'itemSpacing', l.gap);
    if (l.rowGap && target.layoutWrap === 'WRAP') {
      target.counterAxisSpacing = l.rowGap.value;
      bindNum(target, 'counterAxisSpacing', l.rowGap);
    }
    const pads = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const;
    l.padding.forEach((p, i) => {
      target[pads[i]!] = p.value;
      bindNum(target, pads[i]!, p);
    });
    target.primaryAxisAlignItems = l.main;
    target.counterAxisAlignItems = l.cross === 'BASELINE' && l.direction === 'VERTICAL' ? 'MIN' : l.cross === 'STRETCH' ? 'MIN' : l.cross;
  }

  for (const child of def.children) {
    const node = build(child);
    target.appendChild(node);
    if (def.layout) {
      if (child.absolute) node.layoutPositioning = 'ABSOLUTE';
      if (child.sizing && 'layoutSizingHorizontal' in node && !child.absolute) {
        const canHug = node.type === 'TEXT' || (node.type === 'FRAME' && node.layoutMode !== 'NONE');
        const pick = (s: 'FIXED' | 'HUG' | 'FILL') => (s === 'HUG' && !canHug ? 'FIXED' : s);
        node.layoutSizingHorizontal = pick(child.sizing.horizontal);
        node.layoutSizingVertical = pick(child.sizing.vertical);
      }
    }
    if (!def.layout || child.absolute) {
      node.x = child.x;
      node.y = child.y;
    }
  }
}

function build(def: NodeDef): FrameNode | TextNode {
  if (def.type === 'text') return buildText(def);
  if (def.type === 'vector') return buildVector(def);
  const frame = figma.createFrame();
  frame.name = def.name;
  applyFrame(frame, def);
  return frame;
}

function buildText(def: TextDef): TextNode {
  const text = figma.createText();
  text.name = def.name;
  const font = fontCache.get(`${def.font.family}/${def.font.weight}/${def.font.italic}`) ?? FALLBACK;
  text.fontName = font;
  text.characters = def.characters;
  text.fontSize = def.size.value;
  text.lineHeight = { unit: 'PIXELS', value: def.lineHeight };
  text.letterSpacing = { unit: 'PIXELS', value: def.letterSpacing };
  text.fills = [solid(def.color)];
  text.textAlignHorizontal = def.align;
  text.textDecoration = def.decoration;
  text.textCase = def.case;
  if (def.wraps) {
    text.textAutoResize = 'HEIGHT';
    text.resize(Math.max(1, def.width), Math.max(1, def.height));
  } else {
    text.textAutoResize = 'WIDTH_AND_HEIGHT';
  }
  const size = themeVar(def.size.token);
  if (size) text.setBoundVariable('fontSize', size);
  const family = themeVar(def.font.familyToken);
  // Only bind the family when the measured font loaded: otherwise the binding would fight the fallback.
  if (family && font.family === def.font.family) text.setBoundVariable('fontFamily', family);
  if (def.opacity !== undefined) text.opacity = def.opacity;
  return text;
}

function buildVector(def: VectorDef): FrameNode {
  const node = figma.createNodeFromSvg(def.svg);
  node.name = def.name;
  node.resize(Math.max(0.01, def.width), Math.max(0.01, def.height));
  node.fills = [];
  const v = colorVar(def.color?.token);
  if (v) {
    // Rebind every solid stroke and fill to the icon's token, keeping opacity.
    for (const child of node.findAll(() => true)) {
      if ('strokes' in child && Array.isArray(child.strokes) && child.strokes.length) {
        child.strokes = (child.strokes as Paint[]).map((p) => (p.type === 'SOLID' ? figma.variables.setBoundVariableForPaint(p, 'color', v) : p));
      }
      if ('fills' in child && Array.isArray(child.fills) && child.fills.length) {
        child.fills = (child.fills as Paint[]).map((p) => (p.type === 'SOLID' ? figma.variables.setBoundVariableForPaint(p, 'color', v) : p));
      }
    }
  }
  return node;
}

// ---- Components ----

const variantName = (props: Record<string, string>) =>
  Object.entries(props)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');

async function componentsPage(): Promise<PageNode> {
  let page = figma.root.children.find((p) => p.name === PAGE_NAME);
  if (!page) {
    page = figma.createPage();
    page.name = PAGE_NAME;
  }
  await page.loadAsync();
  // New nodes land on the current page; build on the Components page so nothing is left elsewhere.
  await figma.setCurrentPageAsync(page);
  return page;
}

async function buildComponents(defs: ComponentDef[]): Promise<number> {
  await loadVariables();
  const page = await componentsPage();
  for (const def of defs) for (const v of def.variants) await preloadFonts(v.root);

  let y = 0;
  let count = 0;
  for (const def of defs) {
    const sets = page.children.filter((n): n is ComponentSetNode => n.type === 'COMPONENT_SET');
    const existing = sets.find((n) => n.getPluginData(KEY) === def.key) ?? sets.find((n) => n.name === def.name);
    const byName = new Map(existing?.children.filter((c): c is ComponentNode => c.type === 'COMPONENT').map((c) => [c.name, c]) ?? []);
    const components: ComponentNode[] = [];

    for (const variant of def.variants) {
      const name = variantName(variant.props);
      const component = byName.get(name) ?? figma.createComponent();
      byName.delete(name);
      applyFrame(component, variant.root);
      component.name = name;
      const sizing = variant.root.sizing;
      if (sizing && component.layoutMode !== 'NONE') {
        component.layoutSizingHorizontal = sizing.horizontal === 'FILL' ? 'FIXED' : sizing.horizontal;
        component.layoutSizingVertical = sizing.vertical === 'FILL' ? 'FIXED' : sizing.vertical;
      }
      components.push(component);
      count++;
    }
    // Variants that no longer exist in code.
    for (const stale of byName.values()) stale.remove();

    let set: ComponentSetNode;
    if (existing) {
      set = existing;
      for (const c of components) if (c.parent !== set) set.appendChild(c);
    } else {
      set = figma.combineAsVariants(components, page);
      set.setPluginData(KEY, def.key);
    }
    set.name = def.name;
    set.description = def.description ?? '';
    layoutVariants(set, def, components);
    set.x = 0;
    set.y = y;
    y += set.height + 120;
  }
  return count;
}

const SET_PADDING = 32;
const SET_GAP = 24;

/**
 * Grid the variants: one row per value of the first axis, the remaining combinations as columns,
 * so e.g. Button reads as variant × (size, state). Single-axis sets are one row. The set gets the
 * theme's background so ghost and link variants are visible and a mode switch shows the whole look.
 */
function layoutVariants(set: ComponentSetNode, def: ComponentDef, components: ComponentNode[]): void {
  set.layoutMode = 'NONE';
  const axes = Object.keys(def.variants[0]?.props ?? {});
  const rowKey = (props: Record<string, string>) => (axes.length > 1 ? props[axes[0]!]! : '');
  const rows: ComponentNode[][] = [];
  const rowIndex = new Map<string, number>();
  def.variants.forEach((variant, i) => {
    const key = rowKey(variant.props);
    if (!rowIndex.has(key)) {
      rowIndex.set(key, rows.length);
      rows.push([]);
    }
    rows[rowIndex.get(key)!]!.push(components[i]!);
  });

  const colWidths: number[] = [];
  for (const row of rows) row.forEach((c, ci) => (colWidths[ci] = Math.max(colWidths[ci] ?? 0, c.width)));
  let y = SET_PADDING;
  for (const row of rows) {
    let x = SET_PADDING;
    const height = Math.max(...row.map((c) => c.height));
    row.forEach((c, ci) => {
      c.x = x;
      c.y = y;
      x += colWidths[ci]! + SET_GAP;
    });
    y += height + SET_GAP;
  }
  const width = SET_PADDING * 2 + colWidths.reduce((a, w) => a + w, 0) + SET_GAP * Math.max(0, colWidths.length - 1);
  set.resizeWithoutConstraints(Math.max(1, width), Math.max(1, y - SET_GAP + SET_PADDING));
  set.fills = [solid({ color: { r: 1, g: 1, b: 1, a: 1 }, token: 'background' })];
  set.cornerRadius = 12;
}

// ---- Entry ----

// ---- Themes page ----

const THEMES_PAGE = 'Themes';

/** Variant to show from each set on the Themes page, by set name. Missing sets are skipped. */
const SHOWCASE: { set: string; variants: string[] }[] = [
  { set: 'Button', variants: ['variant=default, size=md, state=default', 'variant=secondary, size=md, state=default', 'variant=outline, size=md, state=default', 'variant=ghost, size=md, state=default', 'variant=destructive, size=md, state=default'] },
  { set: 'Badge', variants: ['variant=default', 'variant=secondary', 'variant=outline', 'variant=destructive'] },
  { set: 'Input', variants: ['state=filled'] },
  { set: 'Alert', variants: ['variant=success'] },
  { set: 'Card', variants: ['footer=true'] },
];

/** Every font any theme can switch text to, in every weight the components use. */
async function preloadThemeFonts(defs: ComponentDef[]): Promise<void> {
  const weights = new Set<number>();
  const collect = (n: NodeDef) => {
    if (n.type === 'text') weights.add(n.font.weight);
    if (n.type === 'frame') n.children.forEach(collect);
  };
  for (const def of defs) for (const v of def.variants) collect(v.root);
  const theme = data.variables.collections.find((c) => c.name === THEME_COLLECTION);
  const families = new Set<string>();
  for (const v of theme?.variables ?? []) {
    if (v.type !== 'STRING') continue;
    for (const value of Object.values(v.values)) if (value.kind === 'string') families.add(value.value);
  }
  for (const family of families) for (const w of weights) await resolveFont(family, w, false);
}

/** An empty auto-layout frame that hugs its content. */
function stack(direction: 'HORIZONTAL' | 'VERTICAL', name: string, gap: number): FrameNode {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.itemSpacing = gap;
  frame.fills = [];
  return frame;
}

async function buildThemesPage(defs: ComponentDef[]): Promise<number> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const theme = collections.find((c) => c.name === THEME_COLLECTION);
  const color = collections.find((c) => c.name === COLOR_COLLECTION);
  if (!theme || !color) return 0;
  await preloadThemeFonts(defs);

  const components = figma.root.children.find((p) => p.name === PAGE_NAME);
  if (!components) return 0;
  const sets = components.children.filter((n): n is ComponentSetNode => n.type === 'COMPONENT_SET');

  let page = figma.root.children.find((p) => p.name === THEMES_PAGE);
  if (!page) {
    page = figma.createPage();
    page.name = THEMES_PAGE;
  }
  await page.loadAsync();
  await figma.setCurrentPageAsync(page);
  for (const child of [...page.children]) child.remove();

  const label = fontCache.values().next().value ?? FALLBACK;
  let count = 0;
  theme.modes.forEach((themeMode, row) => {
    color.modes.forEach((colorMode, col) => {
      const frame = stack('VERTICAL', `${themeMode.name} / ${colorMode.name}`, 24);
      frame.paddingTop = frame.paddingBottom = frame.paddingLeft = frame.paddingRight = 32;
      frame.fills = [solid({ color: { r: 1, g: 1, b: 1, a: 1 }, token: 'background' })];
      frame.setExplicitVariableModeForCollection(theme, themeMode.modeId);
      frame.setExplicitVariableModeForCollection(color, colorMode.modeId);

      const title = figma.createText();
      title.fontName = label;
      title.characters = `${themeMode.name} · ${colorMode.name.toLowerCase()}`;
      title.fontSize = 20;
      title.fills = [solid({ color: { r: 0, g: 0, b: 0, a: 1 }, token: 'foreground' })];
      frame.appendChild(title);

      for (const { set: name, variants } of SHOWCASE) {
        const set = sets.find((s) => s.name === name);
        if (!set) continue;
        const rowFrame = stack('HORIZONTAL', name, 12);
        rowFrame.counterAxisAlignItems = 'CENTER';
        for (const v of variants) {
          const component = set.children.find((c): c is ComponentNode => c.type === 'COMPONENT' && c.name === v);
          if (component) rowFrame.appendChild(component.createInstance());
        }
        if (rowFrame.children.length) frame.appendChild(rowFrame);
        else rowFrame.remove();
      }
      frame.x = col * 900;
      frame.y = row * 900;
      count++;
    });
  });
  return count;
}

async function run(): Promise<void> {
  const command = figma.command || 'all';
  const done: string[] = [];
  if (command === 'all' || command === 'variables') {
    await syncVariables(data.variables.collections);
    const n = data.variables.collections.reduce((a, c) => a + c.variables.length, 0);
    done.push(`${n} variables`);
  }
  if (command === 'all' || command === 'components') {
    if (!data.components) throw new Error('No component data in this build. Run `pnpm figma:extract` before `pnpm figma:build`.');
    const n = await buildComponents(data.components.components);
    done.push(`${n} component variants`);
    const frames = await buildThemesPage(data.components.components);
    if (frames) done.push(`${frames} theme previews`);
  }
  const unique = [...new Set(warnings)];
  if (unique.length) console.warn(unique.join('\n'));
  const note = unique.length ? ` ${unique[0]}${unique.length > 1 ? ` (+${unique.length - 1} more in the console)` : ''}` : '';
  figma.closePlugin(`machine-ui: synced ${done.join(' and ')}.${note}`);
}

run().catch((error: unknown) => {
  console.error(error);
  figma.closePlugin(`machine-ui failed: ${errorText(error)}`);
});
