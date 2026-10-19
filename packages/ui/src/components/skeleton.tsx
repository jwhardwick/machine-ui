import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

/** A placeholder that holds the shape of content while it loads. Static when motion is off. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        'animate-shimmer rounded-md bg-muted bg-[linear-gradient(90deg,transparent_25%,color-mix(in_oklch,var(--background)_60%,transparent)_50%,transparent_75%)] bg-[length:200%_100%]',
        className,
      )}
      {...props}
    />
  );
}
