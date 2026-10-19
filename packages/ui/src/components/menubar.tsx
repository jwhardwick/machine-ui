import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { Menubar as MenubarPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { floatingSurface, menuItem } from '../lib/styles.ts';

export function Menubar({ className, ...props }: ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn('flex h-(--control-md) items-center gap-1 rounded-md border bg-background p-1 shadow-sm', className)}
      {...props}
    />
  );
}

export const MenubarMenu = MenubarPrimitive.Menu;
export const MenubarGroup = MenubarPrimitive.Group;
export const MenubarSub = MenubarPrimitive.Sub;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

export function MenubarTrigger({ className, ...props }: ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1 text-sm font-medium text-foreground outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function MenubarContent({ className, align = 'start', alignOffset = -4, sideOffset = 8, ...props }: ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(floatingSurface, 'min-w-48 origin-(--radix-menubar-content-transform-origin) overflow-hidden p-1', className)}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
}

export function MenubarItem({ className, inset, ...props }: ComponentProps<typeof MenubarPrimitive.Item> & { inset?: boolean }) {
  return <MenubarPrimitive.Item data-slot="menubar-item" data-inset={inset} className={cn(menuItem, 'data-[inset]:pl-8', className)} {...props} />;
}

export function MenubarCheckboxItem({ className, children, ...props }: ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem data-slot="menubar-checkbox-item" className={cn(menuItem, 'pl-8', className)} {...props}>
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon aria-hidden />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

export function MenubarSeparator({ className, ...props }: ComponentProps<typeof MenubarPrimitive.Separator>) {
  return <MenubarPrimitive.Separator data-slot="menubar-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}

export function MenubarShortcut({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="menubar-shortcut" className={cn('ml-auto pl-4 text-xs tracking-widest text-muted-foreground', className)} {...props} />;
}

export function MenubarSubTrigger({ className, children, ...props }: ComponentProps<typeof MenubarPrimitive.SubTrigger>) {
  return (
    <MenubarPrimitive.SubTrigger data-slot="menubar-sub-trigger" className={cn(menuItem, 'data-[state=open]:bg-accent', className)} {...props}>
      {children}
      <ChevronRightIcon aria-hidden className="ml-auto" />
    </MenubarPrimitive.SubTrigger>
  );
}

export function MenubarSubContent({ className, ...props }: ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.SubContent data-slot="menubar-sub-content" className={cn(floatingSurface, 'min-w-32 p-1', className)} {...props} />
    </MenubarPrimitive.Portal>
  );
}
