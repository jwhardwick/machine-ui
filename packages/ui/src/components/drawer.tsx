'use client';

import type { ComponentProps } from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '../lib/cn.ts';

/** A bottom sheet with a drag handle. Swipe down or press Escape to close. */
export function Drawer(props: ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;

export function DrawerContent({ className, children, ...props }: ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay data-slot="drawer-overlay" className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm" />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[80vh] flex-col rounded-t-xl border-t bg-popover text-popover-foreground shadow-lg focus-visible:outline-none',
          className,
        )}
        {...props}
      >
        <div aria-hidden className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="drawer-header" className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />;
}

export function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="drawer-footer" className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

export function DrawerTitle({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Title>) {
  return <DrawerPrimitive.Title data-slot="drawer-title" className={cn('font-display text-lg font-semibold', className)} {...props} />;
}

export function DrawerDescription({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Description>) {
  return <DrawerPrimitive.Description data-slot="drawer-description" className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
