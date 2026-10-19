import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

/** A placeholder for a view with nothing in it: icon, title, description and an action. */
export function Empty({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn('flex min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center', className)}
      {...props}
    />
  );
}

export function EmptyMedia({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-media"
      className={cn('flex size-10 items-center justify-center rounded-lg bg-muted text-foreground [&_svg]:size-5', className)}
      {...props}
    />
  );
}

export function EmptyTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="empty-title" className={cn('font-display text-lg font-medium', className)} {...props} />;
}

export function EmptyDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="empty-description" className={cn('max-w-sm text-sm text-muted-foreground', className)} {...props} />;
}

export function EmptyActions({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="empty-actions" className={cn('flex flex-wrap items-center justify-center gap-2', className)} {...props} />;
}
