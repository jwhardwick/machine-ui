import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing, transition } from '../lib/styles.ts';

const itemVariants = cva(['group/item flex flex-wrap items-center gap-4 rounded-md border border-transparent text-sm', transition, focusRing, '[a]:hover:bg-accent'], {
  variants: {
    variant: { default: 'bg-transparent', outline: 'border-border', muted: 'bg-muted' },
    size: { md: 'p-4', sm: 'px-4 py-3' },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

/** A row with media, a title, a description and actions. Lists, settings and search results. */
export function Item({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'div'> & VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'div';
  return <Comp data-slot="item" className={cn(itemVariants({ variant, size }), className)} {...props} />;
}

export function ItemMedia({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-media"
      className={cn('flex shrink-0 items-center justify-center [&_svg]:size-5 [&_svg]:text-muted-foreground', className)}
      {...props}
    />
  );
}

export function ItemContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="item-content" className={cn('flex flex-1 flex-col gap-1', className)} {...props} />;
}

export function ItemTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="item-title" className={cn('flex w-fit items-center gap-2 font-medium leading-snug', className)} {...props} />;
}

export function ItemDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="item-description" className={cn('line-clamp-2 text-sm text-muted-foreground', className)} {...props} />;
}

export function ItemActions({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="item-actions" className={cn('flex items-center gap-2', className)} {...props} />;
}

export function ItemGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div role="list" data-slot="item-group" className={cn('flex flex-col', className)} {...props} />;
}
