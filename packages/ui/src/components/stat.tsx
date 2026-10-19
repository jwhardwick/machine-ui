import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

/** A labelled number with an optional change, coloured and arrowed by direction. */
export function Stat({
  label,
  value,
  change,
  trend,
  className,
  ...props
}: ComponentProps<'div'> & { label: string; value: string; change?: string; trend?: 'up' | 'down' }) {
  return (
    <div data-slot="stat" className={cn('grid gap-1', className)} {...props}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-display text-3xl font-semibold tabular-nums leading-none">{value}</div>
      {change && (
        <div className="flex items-center gap-1 text-sm">
          {trend === 'down' ? (
            <ArrowDownRightIcon aria-hidden className="size-4 text-destructive" />
          ) : (
            <ArrowUpRightIcon aria-hidden className="size-4 text-success" />
          )}
          <span className="tabular-nums text-foreground">{change}</span>
          <span className="sr-only">{trend === 'down' ? 'decrease' : 'increase'}</span>
        </div>
      )}
    </div>
  );
}
