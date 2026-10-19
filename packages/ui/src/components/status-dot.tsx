import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

const TONES = {
  online: 'bg-success',
  busy: 'bg-warning',
  error: 'bg-destructive',
  offline: 'bg-muted-foreground',
  accent: 'bg-primary',
} as const;

/** A small status dot. Pair it with text: colour alone never carries the meaning. */
export function StatusDot({
  tone = 'online',
  pulse = false,
  className,
  ...props
}: ComponentProps<'span'> & { tone?: keyof typeof TONES; pulse?: boolean }) {
  return (
    <span data-slot="status-dot" data-tone={tone} aria-hidden className={cn('relative inline-flex size-2 shrink-0', className)} {...props}>
      {pulse && <span className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-60', TONES[tone])} />}
      <span className={cn('relative inline-flex size-2 rounded-full', TONES[tone])} />
    </span>
  );
}
