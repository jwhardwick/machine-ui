import { applyTheme, serializeSeed, type Mode } from '@machine-ui/theme-engine';
import type { ThemeSeed } from '@machine-ui/tokens';
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { initialState, writeStateToUrl, type PlaygroundState } from '../seed-url.ts';

const STORAGE_KEY = 'machine-ui:theme';

interface SiteTheme extends PlaygroundState {
  setSeed: (seed: ThemeSeed) => void;
  setMode: (mode: Mode) => void;
  /** A link to the current page wearing the current theme. */
  shareUrl: () => string;
}

const ThemeContext = createContext<SiteTheme | null>(null);

export function useSiteTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useSiteTheme must be used inside <SiteThemeProvider>');
  return context;
}

function readStored() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** The whole site wears one theme. It comes from a share link, the last visit, or the defaults. */
export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlaygroundState>(() =>
    initialState(window.location.search, readStored(), window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false),
  );

  useLayoutEffect(() => {
    applyTheme(state.seed, { mode: state.mode });
  }, [state]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, `theme=${serializeSeed(state.seed)}&mode=${state.mode}`);
    } catch {
      // Storage can be unavailable (private mode); the theme still works for this visit.
    }
  }, [state]);

  const value = useMemo<SiteTheme>(
    () => ({
      ...state,
      setSeed: (seed) => setState((s) => ({ ...s, seed })),
      setMode: (mode) => setState((s) => ({ ...s, mode })),
      shareUrl: () => writeStateToUrl(window.location.href, state),
    }),
    [state],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
