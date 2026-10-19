import { cva, type VariantProps } from 'class-variance-authority';
import { PanelLeftIcon } from 'lucide-react';
import { Slot } from 'radix-ui';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type CSSProperties, type ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing, transition } from '../lib/styles.ts';
import { Button } from './button.tsx';
import { Separator } from './separator.tsx';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './sheet.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip.tsx';

const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_ICON = '3.25rem';
const MOBILE_QUERY = '(max-width: 47.99em)';

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used inside <SidebarProvider>');
  return context;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(MOBILE_QUERY).matches);
  useEffect(() => {
    const query = window.matchMedia?.(MOBILE_QUERY);
    if (!query) return;
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return Boolean(mobile);
}

/** Holds open/collapsed state for a Sidebar. Cmd/Ctrl+B toggles it, unless nested inside another provider. */
export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
  ...props
}: ComponentProps<'div'> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [internal, setInternal] = useState(defaultOpen);
  const open = openProp ?? internal;
  const setOpen = useCallback(
    (value: boolean) => {
      setInternal(value);
      onOpenChange?.(value);
    },
    [onOpenChange],
  );
  const toggle = useCallback(() => (isMobile ? setOpenMobile((o) => !o) : setOpen(!open)), [isMobile, open, setOpen]);
  // Only the app's own (outermost) sidebar answers the shortcut, so sidebars inside previews and
  // embedded screens don't all toggle at once.
  const nested = useContext(SidebarContext) !== null;

  useEffect(() => {
    if (nested) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, nested]);

  const value = useMemo(() => ({ open, setOpen, openMobile, setOpenMobile, isMobile, toggle }), [open, setOpen, openMobile, isMobile, toggle]);

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        style={{ '--sidebar-width': SIDEBAR_WIDTH, '--sidebar-width-icon': SIDEBAR_WIDTH_ICON, ...style } as CSSProperties}
        className={cn('group/sidebar-wrapper flex min-h-full w-full', className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  side = 'left',
  collapsible = 'icon',
  className,
  children,
  ...props
}: ComponentProps<'div'> & { side?: 'left' | 'right'; collapsible?: 'offcanvas' | 'icon' | 'none' }) {
  const { isMobile, open, openMobile, setOpenMobile } = useSidebar();

  if (isMobile && collapsible !== 'none') {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side={side} className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Main navigation</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  const state = collapsible === 'none' || open ? 'expanded' : 'collapsed';
  return (
    <div
      data-slot="sidebar"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-side={side}
      className={cn(
        'group/sidebar flex shrink-0 flex-col bg-sidebar text-sidebar-foreground',
        side === 'left' ? 'border-r' : 'order-last border-l',
        transition,
        'w-(--sidebar-width) data-[collapsible=icon]:w-(--sidebar-width-icon) data-[collapsible=offcanvas]:w-0 data-[collapsible=offcanvas]:overflow-hidden data-[collapsible=offcanvas]:border-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger({ className, onClick, ...props }: ComponentProps<typeof Button>) {
  const { toggle } = useSidebar();
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn('size-(--control-sm)', className)}
      onClick={(event) => {
        onClick?.(event);
        toggle();
      }}
      {...props}
    >
      <PanelLeftIcon aria-hidden />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

/** The main content area beside a Sidebar. */
export function SidebarInset({ className, ...props }: ComponentProps<'main'>) {
  return <main data-slot="sidebar-inset" className={cn('relative flex min-w-0 flex-1 flex-col bg-background', className)} {...props} />;
}

export function SidebarHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sidebar-header" className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sidebar-footer" className={cn('mt-auto flex flex-col gap-2 p-2', className)} {...props} />;
}

export function SidebarSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return <Separator data-slot="sidebar-separator" className={cn('mx-2 w-auto', className)} {...props} />;
}

export function SidebarContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]/sidebar:overflow-hidden', className)}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sidebar-group" className={cn('relative flex w-full min-w-0 flex-col p-2', className)} {...props} />;
}

export function SidebarGroupLabel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground',
        transition,
        'group-data-[collapsible=icon]/sidebar:-mt-8 group-data-[collapsible=icon]/sidebar:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sidebar-group-content" className={cn('w-full text-sm', className)} {...props} />;
}

export function SidebarMenu({ className, ...props }: ComponentProps<'ul'>) {
  return <ul data-slot="sidebar-menu" className={cn('flex w-full min-w-0 flex-col gap-1', className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: ComponentProps<'li'>) {
  return <li data-slot="sidebar-menu-item" className={cn('group/menu-item relative', className)} {...props} />;
}

const sidebarMenuButtonVariants = cva(
  [
    'peer/menu-button flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm',
    transition,
    focusRing,
    'hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
    'data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground',
    'group-data-[collapsible=icon]/sidebar:size-8 group-data-[collapsible=icon]/sidebar:p-2',
    '[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  ],
  {
    variants: {
      size: { sm: 'h-7 text-xs', md: 'h-8', lg: 'h-12 group-data-[collapsible=icon]/sidebar:p-0' },
    },
    defaultVariants: { size: 'md' },
  },
);

export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  tooltip,
  size,
  className,
  ...props
}: ComponentProps<'button'> & { asChild?: boolean; isActive?: boolean; tooltip?: string } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot.Root : 'button';
  const { open, isMobile } = useSidebar();
  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      aria-current={isActive ? 'page' : undefined}
      className={cn(sidebarMenuButtonVariants({ size }), className)}
      {...props}
    />
  );
  if (!tooltip || open || isMobile) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export function SidebarMenuBadge({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={cn(
        'pointer-events-none absolute right-1 top-1.5 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-muted-foreground group-data-[collapsible=icon]/sidebar:hidden',
        className,
      )}
      {...props}
    />
  );
}
