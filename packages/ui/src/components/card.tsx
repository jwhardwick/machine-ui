import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

/** Borders or shadows come from the theme's separation axis via `--card-border-width` and `--elevation-md`. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col rounded-lg border-(length:--card-border-width) border-border bg-card text-card-foreground shadow-md',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-header" className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('font-display text-xl font-semibold leading-tight', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6 pb-6', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn('flex items-center px-6 pb-6', className)} {...props} />;
}
