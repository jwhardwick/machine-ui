import { CodingAgentScreen, DashboardScreen, SettingsScreen } from '@machine-ui/examples';
import { applyTheme, type Mode } from '@machine-ui/theme-engine';
import { REFERENCE_THEMES, type ThemeSeed } from '@machine-ui/tokens';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { describe, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { ThemeMatrix } from '../src/theme-matrix.tsx';

function Themed({ seed, mode, children }: { seed: ThemeSeed; mode: Mode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const applied = applyTheme(seed, { target: ref.current!, mode });
    return () => applied.dispose();
  }, [seed, mode]);
  return (
    <div ref={ref} data-testid="frame" className="h-[50rem] w-[80rem] overflow-hidden bg-background font-sans text-foreground">
      {children}
    </div>
  );
}

const preset = (name: string) => REFERENCE_THEMES.find((t) => t.name === name)!;
const SCREENS = { 'coding-agent': CodingAgentScreen, dashboard: DashboardScreen, settings: SettingsScreen };

describe('theme matrix', () => {
  test('every preset in light and dark', async () => {
    await page.viewport(1280, 3400);
    render(
      <div data-testid="matrix">
        <ThemeMatrix />
      </div>,
    );
    await expect.element(page.getByTestId('matrix')).toMatchScreenshot('theme-matrix');
  });
});

describe('screens', () => {
  for (const name of ['console', 'bloom'] as const) {
    for (const mode of ['light', 'dark'] as const) {
      for (const [slug, Screen] of Object.entries(SCREENS)) {
        test(`${slug} in ${name} ${mode}`, async () => {
          await page.viewport(1280, 900);
          render(
            <Themed seed={preset(name)} mode={mode}>
              <Screen />
            </Themed>,
          );
          await expect.element(page.getByTestId('frame')).toMatchScreenshot(`${slug}-${name}-${mode}`);
        });
      }
    }
  }
});
