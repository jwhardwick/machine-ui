import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { transition } from '../lib/styles.ts';
import { Button } from './button.tsx';

/** A text field with prefix or suffix content (icons, text, buttons) inside one border. */
export function InputGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'flex h-(--control-md) w-full min-w-0 items-center rounded-md border border-input bg-background text-foreground shadow-sm',
        transition,
        'has-[[data-slot=input-group-control]:focus-visible]:outline-2 has-[[data-slot=input-group-control]:focus-visible]:outline-offset-2 has-[[data-slot=input-group-control]:focus-visible]:outline-ring',
        'has-[[aria-invalid=true]]:border-destructive has-[:disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupAddon({
  className,
  align = 'start',
  ...props
}: ComponentProps<'div'> & { align?: 'start' | 'end' }) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        'flex h-full shrink-0 select-none items-center gap-1.5 text-sm text-muted-foreground [&>svg]:size-4',
        align === 'start' ? 'order-first pl-3' : 'order-last pr-1.5 has-[>span]:pr-3',
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupText({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="input-group-text" className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function InputGroupInput({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        'h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed sm:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export function InputGroupButton({ className, size = 'sm', variant = 'ghost', ...props }: ComponentProps<typeof Button>) {
  return <Button data-slot="input-group-button" size={size} variant={variant} className={cn('h-(--control-sm) px-2', className)} {...props} />;
}
