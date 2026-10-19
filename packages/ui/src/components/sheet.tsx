'use client';

import { XIcon } from 'lucide-react';
import { Dialog as SheetPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing } from '../lib/styles.ts';

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

const SIDES = {
  right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=open]:animate-sheet-right',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=open]:animate-sheet-left',
  top: 'inset-x-0 top-0 h-auto border-b data-[state=open]:animate-sheet-top',
  bottom: 'inset-x-0 bottom-0 h-auto border-t data-[state=open]:animate-sheet-bottom',
} as const;

/** A panel that slides in from any edge of the screen over a scrim. */
export function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & { side?: keyof typeof SIDES }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay
        data-slot="sheet-overlay"
        className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=open]:animate-overlay"
      />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn('fixed z-50 flex flex-col gap-4 bg-popover text-popover-foreground shadow-lg focus-visible:outline-none', SIDES[side], className)}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className={cn('absolute right-4 top-4 cursor-pointer rounded-sm text-muted-foreground hover:text-foreground [&_svg]:size-4', focusRing)}
        >
          <XIcon aria-hidden />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sheet-header" className={cn('flex flex-col gap-1.5 p-4 pr-10', className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sheet-footer" className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn('font-display text-lg font-semibold', className)} {...props} />;
}

export function SheetDescription({ className, ...props }: ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description data-slot="sheet-description" className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
