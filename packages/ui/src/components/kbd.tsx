import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded-sm border bg-muted px-1 font-mono text-xs font-medium text-muted-foreground [&_svg]:size-3',
        className,
      )}
      {...props}
    />
  );
}

export function KbdGroup({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="kbd-group" className={cn('inline-flex items-center gap-1', className)} {...props} />;
}
