/** Shared class fragments so every control focuses, disables and animates the same way. */
export const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

export const disabledControl = 'disabled:cursor-not-allowed disabled:opacity-50';

export const transition = 'transition-[color,background-color,border-color,box-shadow,opacity] duration-(--motion-fast) ease-standard';

/** Floating surfaces: popovers, menus, tooltips, hover cards. */
export const floatingSurface =
  'z-50 rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-enter';

/** Field chrome shared by inputs, selects and textareas. */
export const fieldChrome =
  'w-full min-w-0 rounded-md border border-input bg-background text-foreground shadow-sm placeholder:text-muted-foreground aria-invalid:border-destructive';

/** One row in a menu-like list. */
export const menuItem =
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';
