import { applyTheme, serializeSeed } from '@machine-ui/theme-engine';
import { TYPE_PAIRS, type ThemeSeed } from '@machine-ui/tokens';
import { buttonVariants, cn } from '@machine-ui/ui';
import { useLayoutEffect, useRef } from 'react';
import { useSiteTheme } from './theme.tsx';

const SWATCHES = ['primary', 'accent', 'secondary', 'success', 'warning', 'destructive'] as const;

function describe(seed: ThemeSeed) {
  const corners = seed.radius < 0.1 ? 'square' : seed.radius < 0.4 ? 'tight corners' : 'soft corners';
  const surfaces = seed.separation < 0.5 ? 'borders' : 'shadows';
  return `${seed.neutral} greys, ${corners}, ${surfaces}`;
}

/**
 * A theme rendered in itself: its typeface, colours, corners and surfaces, in a scoped container.
 * The whole card is one button that dresses the site in this theme.
 */
export function Specimen({ seed }: { seed: ThemeSeed }) {
  const { seed: active, mode, setSeed } = useSiteTheme();
  const ref = useRef<HTMLButtonElement>(null);
  const selected = serializeSeed(active) === serializeSeed(seed);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const applied = applyTheme(seed, { target: ref.current, mode });
    return () => applied.dispose();
  }, [seed, mode]);

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      onClick={() => setSeed(seed)}
      className={cn(
        'group grid cursor-pointer content-start gap-4 rounded-xl border-(length:--card-border-width) border-border bg-card p-5 text-left text-card-foreground shadow-md',
        'transition-[box-shadow,translate] duration-(--motion-fast) ease-standard hover:-translate-y-0.5',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'aria-pressed:outline-2 aria-pressed:outline-offset-4 aria-pressed:outline-primary',
      )}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="font-display text-2xl font-semibold capitalize leading-none">{seed.name}</span>
        <span className="font-display text-2xl leading-none text-muted-foreground" aria-hidden>
          Aa
        </span>
      </span>
      <span className="text-sm text-muted-foreground">
        {TYPE_PAIRS[seed.typePair].label}
        <br />
        {describe(seed)}
      </span>
      <span className="flex items-center gap-2" aria-hidden>
        <span className={buttonVariants({ size: 'sm' })}>Get started</span>
        <span className={buttonVariants({ size: 'sm', variant: 'outline' })}>Docs</span>
      </span>
      <span className="flex gap-1.5" aria-hidden>
        {SWATCHES.map((role) => (
          <span key={role} className="size-5 rounded-sm border" style={{ background: `var(--${role})` }} />
        ))}
      </span>
      <span className="sr-only">{selected ? 'Current theme' : `Use the ${seed.name} theme`}</span>
    </button>
  );
}
