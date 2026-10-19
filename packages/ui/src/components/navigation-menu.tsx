'use client';

import { cva } from 'class-variance-authority';
import { ChevronDownIcon } from 'lucide-react';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing, transition } from '../lib/styles.ts';

export function NavigationMenu({ className, children, ...props }: ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn('relative flex max-w-max flex-1 items-center justify-center', className)}
      {...props}
    >
      {children}
      <div className="absolute left-0 top-full isolate z-50 flex justify-center">
        <NavigationMenuPrimitive.Viewport
          data-slot="navigation-menu-viewport"
          className="relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-enter md:w-(--radix-navigation-menu-viewport-width)"
        />
      </div>
    </NavigationMenuPrimitive.Root>
  );
}

export function NavigationMenuList({ className, ...props }: ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return <NavigationMenuPrimitive.List data-slot="navigation-menu-list" className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)} {...props} />;
}

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export const navigationMenuTriggerStyle = cva([
  'group inline-flex h-(--control-md) w-max cursor-pointer items-center justify-center rounded-md bg-transparent px-4 text-sm font-medium text-foreground',
  transition,
  focusRing,
  'hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
]);

export function NavigationMenuTrigger({ className, children, ...props }: ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger data-slot="navigation-menu-trigger" className={cn(navigationMenuTriggerStyle(), 'group', className)} {...props}>
      {children}
      <ChevronDownIcon
        aria-hidden
        className="relative top-px ml-1 size-3 transition-transform duration-(--motion-normal) group-data-[state=open]:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

export function NavigationMenuContent({ className, ...props }: ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return <NavigationMenuPrimitive.Content data-slot="navigation-menu-content" className={cn('left-0 top-0 w-full p-2 md:absolute md:w-auto', className)} {...props} />;
}

export function NavigationMenuLink({ className, ...props }: ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        'flex flex-col gap-1 rounded-sm p-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        focusRing,
        className,
      )}
      {...props}
    />
  );
}
