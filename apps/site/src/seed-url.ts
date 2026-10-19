import { parseSeed, serializeSeed, type Mode } from '@machine-ui/theme-engine';
import { DEFAULT_SEED, type ThemeSeed } from '@machine-ui/tokens';

export interface PlaygroundState {
  seed: ThemeSeed;
  mode: Mode;
}

/** Theme and mode from a share link, if it carries them. */
export function readStateFromSearch(search: string): Partial<PlaygroundState> {
  const params = new URLSearchParams(search);
  const seed = parseSeed(params.get('theme'));
  const mode = params.get('mode');
  return {
    ...(seed ? { seed } : {}),
    ...(mode === 'dark' || mode === 'light' ? { mode } : {}),
  };
}

export function writeStateToUrl(href: string, { seed, mode }: PlaygroundState): string {
  const url = new URL(href);
  url.searchParams.set('theme', serializeSeed(seed));
  url.searchParams.set('mode', mode);
  return url.toString();
}

/** Resolve the starting state: share link, then the visitor's last choice, then defaults. */
export function initialState(search: string, stored: string | null, prefersDark: boolean): PlaygroundState {
  const fromUrl = readStateFromSearch(search);
  const fromStorage = stored ? readStateFromSearch(`?${stored}`) : {};
  return {
    seed: fromUrl.seed ?? fromStorage.seed ?? DEFAULT_SEED,
    mode: fromUrl.mode ?? fromStorage.mode ?? (prefersDark ? 'dark' : 'light'),
  };
}
