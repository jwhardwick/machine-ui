import { CATEGORIES, COMPONENTS, SCREENS } from '@machine-ui/examples/catalog';
import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Kbd,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  Toaster,
  useSidebar,
} from '@machine-ui/ui';
import { BookOpen, ChevronRight, Component, Home, LayoutTemplate, Palette, Search } from 'lucide-react';
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation, useMatch, useResolvedPath } from 'react-router';
import { Loading } from './loading.tsx';
import { SearchCommand } from './search.tsx';
import { ThemeToolbar } from './toolbar.tsx';

/**
 * A nav link that is active when its path matches. A link with a hash also needs that hash in the URL;
 * `ownedHashes` lists the hashes that belong to sibling links, so a page link steps aside for them.
 */
function NavItem({
  to,
  children,
  end = true,
  size,
  ownedHashes = [],
}: {
  to: string;
  children: ReactNode;
  end?: boolean;
  size?: 'sm' | 'md';
  ownedHashes?: string[];
}) {
  const { setOpenMobile } = useSidebar();
  const { hash } = useLocation();
  const resolved = useResolvedPath(to);
  const pathActive = Boolean(useMatch({ path: resolved.pathname, end }));
  const active = pathActive && (resolved.hash ? hash === resolved.hash : !ownedHashes.includes(hash));
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} size={size}>
        <Link to={to} aria-current={active ? 'page' : undefined} onClick={() => setOpenMobile(false)}>
          {children}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // The target can be on a page whose code is still loading, so wait for it to appear.
    const scroll = () => {
      const target = document.getElementById(hash.slice(1));
      target?.scrollIntoView();
      return Boolean(target);
    };
    if (scroll()) return;
    const observer = new MutationObserver(() => scroll() && observer.disconnect());
    observer.observe(document.body, { childList: true, subtree: true });
    const giveUp = window.setTimeout(() => observer.disconnect(), 5000);
    return () => {
      observer.disconnect();
      window.clearTimeout(giveUp);
    };
  }, [pathname, hash]);
  return null;
}

export function Shell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <SidebarProvider>
      <ScrollToTop />
      <Sidebar collapsible="offcanvas" className="sticky top-0 h-dvh">
        <SidebarHeader className="gap-3 p-3">
          <NavLink to="/" className="flex items-center gap-2 rounded-md px-1 font-display text-lg font-semibold focus-visible:outline-2 focus-visible:outline-ring">
            <span aria-hidden className="inline-block size-5 rounded-sm bg-primary" />
            machine-ui
          </NavLink>
          <Button variant="outline" size="sm" className="justify-start text-muted-foreground" onClick={() => setSearchOpen(true)}>
            <Search aria-hidden /> Search
            <Kbd className="ml-auto">⌘K</Kbd>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem to="/">
                  <Home aria-hidden /> Overview
                </NavItem>
                <NavItem to="/get-started">
                  <BookOpen aria-hidden /> Get started
                </NavItem>
                <NavItem to="/themes">
                  <Palette aria-hidden /> Themes
                </NavItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              <LayoutTemplate aria-hidden className="mr-2 size-3.5" /> Screens
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem to="/screens" size="sm" ownedHashes={SCREENS.map((s) => `#${s.slug}`)}>
                  All screens
                </NavItem>
                {SCREENS.map((s) => (
                  <NavItem key={s.slug} to={`/screens#${s.slug}`} size="sm">
                    {s.name}
                  </NavItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Component aria-hidden className="mr-2 size-3.5" /> Components
              <Badge variant="secondary" className="ml-auto">
                {COMPONENTS.length}
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem to="/components" size="sm">
                  All components
                </NavItem>
                {CATEGORIES.map((category) => {
                  const docs = COMPONENTS.filter((d) => d.category === category.id);
                  const containsCurrent = docs.some((d) => pathname === `/components/${d.slug}`);
                  return (
                    <Collapsible key={category.id} asChild defaultOpen={containsCurrent} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton size="sm">
                            <ChevronRight aria-hidden className="transition-transform duration-(--motion-fast) group-data-[state=open]/collapsible:rotate-90" />
                            <span>{category.label}</span>
                            <span className="ml-auto text-xs tabular-nums text-muted-foreground">{docs.length}</span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenu className="ml-4 border-l pl-2">
                            {docs.map((doc) => (
                              <NavItem key={doc.slug} to={`/components/${doc.slug}`} size="sm">
                                {doc.name}
                              </NavItem>
                            ))}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3 text-xs text-muted-foreground">Built on shadcn/ui and Radix.</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b bg-background px-3 md:hidden">
          <SidebarTrigger />
          <span className="font-display font-semibold">machine-ui</span>
        </header>
        <div className="mx-auto w-full max-w-6xl px-4 pb-32 pt-10 sm:px-8 lg:pt-14">
          <Suspense fallback={<Loading className="min-h-96" />}>
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
      <ThemeToolbar />
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
