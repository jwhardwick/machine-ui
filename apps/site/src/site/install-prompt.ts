import { serializeSeed } from '@machine-ui/theme-engine';
import type { ThemeSeed } from '@machine-ui/tokens';

/** The prompt a person pastes into their coding agent to adopt machine-ui with their current theme. */
export function installPrompt(seed: ThemeSeed): string {
  return `Install the machine-ui design system in this React project and apply my theme.

1. Install: npm i @machine-ui/ui @machine-ui/theme-engine @machine-ui/tokens
2. In the global stylesheet, after Tailwind: @import "@machine-ui/ui/styles.css";
3. At app start-up:
   import { applyTheme, parseSeed } from '@machine-ui/theme-engine';
   applyTheme(parseSeed('${serializeSeed(seed)}')!);
4. Build UI only from @machine-ui/ui components. Style with semantic tokens (bg-primary, text-muted-foreground, border-border). Never use raw colours, px values, gradients or font names.
5. Run the project's lint and tests before you finish.`;
}
