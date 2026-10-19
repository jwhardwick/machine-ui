import { applyTheme } from '@machine-ui/theme-engine';
import { useEffect, useLayoutEffect, useState } from 'react';
import { readStateFromSearch, writeStateToUrl, type PlaygroundState } from './seed-url.ts';

/** Playground state, mirrored into the URL and applied to :root on every change. */
export function usePlayground() {
  const [state, setState] = useState<PlaygroundState>(() => readStateFromSearch(window.location.search));

  useLayoutEffect(() => {
    applyTheme(state.seed, { mode: state.mode });
  }, [state]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      window.history.replaceState(null, '', writeStateToUrl(window.location.href, state));
    }, 150);
    return () => window.clearTimeout(id);
  }, [state]);

  return [state, setState] as const;
}
