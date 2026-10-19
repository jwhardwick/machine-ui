import { parseSeed, serializeSeed, type Mode } from '@machine-ui/theme-engine';
import { DEFAULT_SEED, type ThemeSeed } from '@machine-ui/tokens';

export interface PlaygroundState {
  seed: ThemeSeed;
  mode: Mode;
}

export function readStateFromSearch(search: string): PlaygroundState {
  const params = new URLSearchParams(search);
  return {
    seed: parseSeed(params.get('theme')) ?? DEFAULT_SEED,
    mode: params.get('mode') === 'dark' ? 'dark' : 'light',
  };
}

export function writeStateToUrl(href: string, { seed, mode }: PlaygroundState): string {
  const url = new URL(href);
  url.searchParams.set('theme', serializeSeed(seed));
  url.searchParams.set('mode', mode);
  return url.toString();
}
