import { TYPE_PAIRS, type ThemeSeed } from '@machine-ui/tokens';

/** The registry entry for components.json, pointing at wherever this site is hosted. */
export const registryEntry = (origin: string) => `"registries": { "@machine-ui": "${origin}/r/{name}.json" }`;

export const fontsLink = (seed: ThemeSeed) =>
  `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${TYPE_PAIRS[seed.typePair].googleFontsQuery}&display=swap" />`;

/** The prompt a person pastes into their coding agent to adopt machine-ui with their current theme. */
export function installPrompt(seed: ThemeSeed, origin: string): string {
  return `Add the machine-ui design system to this React + Tailwind v4 project with the shadcn CLI, using my theme.

1. If there is no components.json, run: npx shadcn@latest init
2. In components.json add: ${registryEntry(origin)}
3. Install the theme (it brings the token mapping with it): npx shadcn@latest add @machine-ui/theme-${seed.name}
4. Load the theme's fonts in the document head: ${fontsLink(seed)}
5. Install components as you need them, for example: npx shadcn@latest add @machine-ui/button @machine-ui/card @machine-ui/sidebar
   The full list, with descriptions and props, is at ${origin}/llms.txt
6. Build UI only from these components. Style with semantic tokens (bg-primary, text-muted-foreground, border-border). Never use raw colours, px values, gradients or font names.
7. Run the project's typecheck, lint and build before you finish.`;
}
