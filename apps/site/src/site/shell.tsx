import { CATEGORIES, COMPONENT_DOCS, SCREENS } from '@machine-ui/examples';
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
import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation, useMatch, useResolvedPath } from 'react-router';
import { SearchCommand } from './search.tsx';
import { ThemeToolbar } from './toolbar.tsx';

function NavItem({ to, children, end = true }: { to: string; children: ReactNode; end?: boolean }) {
  const { setOpenMobile } = useSidebar();
  const resolved = useResolvedPath(to);
  const active = Boolean(useMatch({ path: resolved.pathname, end }));
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active}>
        <NavLink to={to} end={end} onClick={() => setOpenMobile(false)}>
          {children}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
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
                <NavItem to="/screens">
                  All screens
                </NavItem>
                {SCREENS.map((s) => (
                  <SidebarMenuItem key={s.slug}>
                    <SidebarMenuButton asChild size="sm">
                      <NavLink to={`/screens#${s.slug}`}>{s.name}</NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Component aria-hidden className="mr-2 size-3.5" /> Components
              <Badge variant="secondary" className="ml-auto">
                {COMPONENT_DOCS.length}
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem to="/components">
                  All components
                </NavItem>
                {CATEGORIES.map((category) => {
                  const docs = COMPONENT_DOCS.filter((d) => d.category === category.id);
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
                              <NavItem key={doc.slug} to={`/components/${doc.slug}`}>
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
          <Outlet />
        </div>
      </SidebarInset>
      <ThemeToolbar />
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
