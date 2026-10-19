import type { ThemeSeed, ThemeTokens } from '@machine-ui/tokens';
import { themeToCss } from './css.ts';
import { generateTheme } from './generate.ts';
import type { Mode } from './palette.ts';

export interface ApplyThemeOptions {
  /** Element to theme. Defaults to `document.documentElement` (`:root`). */
  target?: HTMLElement;
  /** Pin the target to a mode. Left alone when omitted, so `.dark` on an ancestor still works. */
  mode?: Mode;
}

export interface AppliedTheme {
  tokens: ThemeTokens;
  /** Remove the theme's styles and any mode this call set. */
  dispose(): void;
}

const CACHE_LIMIT = 32;
const cache = new Map<string, ThemeTokens>();
const scopes = new WeakMap<HTMLElement, string>();
let nextScope = 1;

function tokensFor(seed: ThemeSeed): ThemeTokens {
  const key = JSON.stringify(seed);
  let tokens = cache.get(key);
  if (!tokens) {
    tokens = generateTheme(seed);
    if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value as string);
    cache.set(key, tokens);
  }
  return tokens;
}

/**
 * Compute a theme and write it as CSS variables. Calling again for the same target
 * replaces the previous theme in place, so this is safe to call on every slider tick.
 */
export function applyTheme(seed: ThemeSeed, opts: ApplyThemeOptions = {}): AppliedTheme {
  const doc = opts.target?.ownerDocument ?? document;
  const target = opts.target ?? doc.documentElement;
  const isRoot = target === doc.documentElement;

  let scope = isRoot ? 'root' : scopes.get(target);
  if (!scope) {
    scope = String(nextScope++);
    scopes.set(target, scope);
  }
  if (!isRoot) target.dataset.muiScope = scope;

  const tokens = tokensFor(seed);
  let style = doc.head.querySelector<HTMLStyleElement>(`style[data-mui-theme="${scope}"]`);
  if (!style) {
    style = doc.createElement('style');
    style.dataset.muiTheme = scope;
    doc.head.appendChild(style);
  }
  style.textContent = themeToCss(tokens, { selector: isRoot ? ':root' : `[data-mui-scope="${scope}"]` });

  if (opts.mode) {
    target.dataset.mode = opts.mode;
    if (!isRoot) target.style.colorScheme = opts.mode;
  }

  const ownStyle = style;
  return {
    tokens,
    dispose() {
      ownStyle.remove();
      if (opts.mode && target.dataset.mode === opts.mode) {
        delete target.dataset.mode;
        if (!isRoot) target.style.removeProperty('color-scheme');
      }
    },
  };
}
