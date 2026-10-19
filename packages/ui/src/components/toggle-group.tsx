'use client';

import type { VariantProps } from 'class-variance-authority';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { createContext, useContext, type ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { toggleVariants } from './toggle.tsx';

type ToggleStyle = VariantProps<typeof toggleVariants>;
const ToggleGroupContext = createContext<ToggleStyle>({ variant: 'default', size: 'md' });

export function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root> & ToggleStyle) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      className={cn('group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-sm', className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

export function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item> & ToggleStyle) {
  const context = useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({ variant: context.variant ?? variant, size: context.size ?? size }),
        'shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus-visible:z-10',
        'data-[variant=outline]:border-l-0 group-data-[variant=outline]/toggle-group:border-l-0 group-data-[variant=outline]/toggle-group:first:border-l',
        className,
      )}
      {...props}
    />
  );
}
