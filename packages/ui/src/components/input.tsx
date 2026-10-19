import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

export function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-(--control-md) w-full min-w-0 rounded-md border border-input bg-background px-3 text-base text-foreground shadow-sm sm:text-sm',
        'transition-[border-color,box-shadow] duration-(--motion-fast) ease-standard',
        'placeholder:text-muted-foreground file:border-0 file:bg-transparent file:font-medium',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive',
        className,
      )}
      {...props}
    />
  );
}
