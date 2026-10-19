'use client';

import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { floatingSurface } from '../lib/styles.ts';

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export function HoverCardContent({ className, align = 'center', sideOffset = 6, ...props }: ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(floatingSurface, 'w-64 origin-(--radix-hover-card-content-transform-origin) p-4 outline-none', className)}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
