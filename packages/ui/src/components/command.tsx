'use client';

import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';
import { useComposedRefs } from 'radix-ui/internal';
import { useRef, type ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog.tsx';

/**
 * cmdk keeps the selected item visible by calling `scrollIntoView`, which also scrolls the page,
 * so an inline command list below the fold yanks the page down on mount. Confine it to the list.
 */
function scrollWithinList(node: HTMLElement) {
  const list = node.closest<HTMLElement>('[cmdk-list]');
  if (!list) return;
  const listBox = list.getBoundingClientRect();
  const box = node.getBoundingClientRect();
  if (box.top < listBox.top) list.scrollTop -= listBox.top - box.top;
  else if (box.bottom > listBox.bottom) list.scrollTop += box.bottom - listBox.bottom;
}

function confineScroll(node: HTMLElement | null) {
  if (node) node.scrollIntoView = () => scrollWithinList(node);
}

export function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', className)}
      {...props}
    />
  );
}

/**
 * A command palette in a modal, opened from a button or shortcut. Radix only returns focus to a
 * DialogTrigger, which a palette usually doesn't have, so it remembers what had focus on open.
 */
export function CommandDialog({
  title = 'Command palette',
  description = 'Search for a command to run.',
  children,
  open,
  ...props
}: ComponentProps<typeof Dialog> & { title?: string; description?: string }) {
  const returnFocus = useRef<HTMLElement | null>(null);

  return (
    <Dialog open={open} {...props}>
      <DialogContent
        className="overflow-hidden p-0"
        showCloseButton={false}
        // Fires just before Radix moves focus into the dialog, so activeElement is still the opener.
        onOpenAutoFocus={() => {
          returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }}
        onCloseAutoFocus={(event) => {
          const target = returnFocus.current;
          if (target?.isConnected) {
            event.preventDefault();
            target.focus();
          }
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

export function CommandInput({ className, ...props }: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex h-(--control-lg) items-center gap-2 border-b px-3">
      <SearchIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'flex h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function CommandList({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn('max-h-80 scroll-py-1 overflow-y-auto overflow-x-hidden', className)}
      {...props}
    />
  );
}

export function CommandEmpty(props: ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty data-slot="command-empty" className="py-6 text-center text-sm text-muted-foreground" {...props} />;
}

const confineHeadingScroll = (node: HTMLDivElement | null) =>
  confineScroll(node?.querySelector<HTMLElement>('[cmdk-group-heading]') ?? null);

export function CommandGroup({ className, ref, ...props }: ComponentProps<typeof CommandPrimitive.Group>) {
  const mergedRef = useComposedRefs(ref, confineHeadingScroll);
  return (
    <CommandPrimitive.Group
      ref={mergedRef}
      data-slot="command-group"
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

/** A visual divider between groups. Decorative: cmdk's own separator role isn't allowed inside a listbox. */
export function CommandSeparator({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden data-slot="command-separator" className={cn('-mx-1 h-px bg-border', className)} {...props} />;
}

export function CommandItem({ className, ref, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  const mergedRef = useComposedRefs(ref, confineScroll);
  return (
    <CommandPrimitive.Item
      ref={mergedRef}
      data-slot="command-item"
      className={cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function CommandShortcut({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="command-shortcut" className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props} />;
}
