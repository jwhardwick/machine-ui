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
    <div data-slot="stat" className={cn('@container grid gap-1', className)} {...props}>
      <div className="text-sm text-muted-foreground">{label}</div>
      {/* Sized by the card, not the viewport: display faces range from narrow to very wide. */}
      <div data-slot="stat-value" className="font-display text-xl font-semibold tabular-nums leading-none @3xs:text-2xl @2xs:text-3xl">
        {value}
      </div>
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
