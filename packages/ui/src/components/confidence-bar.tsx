import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

function level(value: number) {
  if (value > 80) return { word: 'High', tone: 'bg-success' };
  if (value > 50) return { word: 'Medium', tone: 'bg-warning' };
  return { word: 'Low', tone: 'bg-destructive' };
}

/** How sure the agent is, as a bar and a word, so colour is never the only signal. */
export function ConfidenceBar({ value, label = 'Confidence', className, ...props }: ComponentProps<'div'> & { value: number; label?: string }) {
  const { word, tone } = level(value);
  return (
    <div data-slot="confidence-bar" className={cn('grid w-full gap-1.5', className)} {...props}>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">
          {word} · {value}%
        </span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${word}, ${value}%`}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div className={cn('h-full rounded-full transition-[width] duration-(--motion-slow) ease-standard', tone)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
