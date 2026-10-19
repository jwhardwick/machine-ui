import { cva, type VariantProps } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing, transition } from '../lib/styles.ts';

export const toggleVariants = cva(
  [
    'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
    transition,
    focusRing,
    'hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50',
    'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'bg-transparent text-foreground',
        outline: 'border border-input bg-transparent text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-(--control-sm) min-w-(--control-sm) px-2',
        md: 'h-(--control-md) min-w-(--control-md) px-2.5',
        lg: 'h-(--control-lg) min-w-(--control-lg) px-3',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export function Toggle({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, size }), className)} {...props} />;
}
