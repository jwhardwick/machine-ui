import { applyTheme, type Mode } from '@machine-ui/theme-engine';
import { REFERENCE_THEMES, type ThemeSeed } from '@machine-ui/tokens';
import { useLayoutEffect, useRef } from 'react';
import { Showcase } from './showcase.tsx';

function ThemeCell({ seed, mode }: { seed: ThemeSeed; mode: Mode }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const applied = applyTheme(seed, { target: ref.current, mode });
    return () => applied.dispose();
  }, [seed, mode]);

  return (
    <section
      ref={ref}
      data-theme-cell={seed.name}
      aria-label={`${seed.name}, ${mode}`}
      className="grid content-start gap-4 bg-background p-6 font-sans text-foreground"
    >
      <h2 className="font-display text-2xl">
        {seed.name} <span className="text-sm text-muted-foreground">{mode}</span>
      </h2>
      <Showcase />
    </section>
  );
}

export function ThemeMatrix({ themes = REFERENCE_THEMES }: { themes?: readonly ThemeSeed[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))]">
      {themes.flatMap((seed) =>
        (['light', 'dark'] as const).map((mode) => <ThemeCell key={`${seed.name}-${mode}`} seed={seed} mode={mode} />),
      )}
    </div>
  );
}
