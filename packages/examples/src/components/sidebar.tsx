import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@machine-ui/ui';
import { BarChart3, Home, Inbox, Settings, Users } from 'lucide-react';
import { defineDoc } from '../types.ts';

const NAV = [
  { label: 'Home', icon: Home, active: true },
  { label: 'Inbox', icon: Inbox, badge: '12' },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Team', icon: Users },
];

export default defineDoc({
  slug: 'sidebar',
  name: 'Sidebar',
  category: 'navigation',
  description: 'App navigation that collapses to icons on desktop and becomes a sheet on mobile. Press Ctrl+B or ⌘B to show or hide it.',
  examples: [
    {
      name: 'App shell',
      wide: true,
      render: () => (
        <div className="h-80 w-full max-w-3xl overflow-hidden rounded-lg border">
          <SidebarProvider className="h-full">
            <Sidebar>
              <SidebarHeader>
                <div className="flex h-8 items-center gap-2 px-2 font-display font-semibold group-data-[collapsible=icon]/sidebar:hidden">Northwind</div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {NAV.map((item) => (
                        <SidebarMenuItem key={item.label}>
                          <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                            <item.icon aria-hidden />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                          {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarSeparator />
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings aria-hidden />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="flex h-12 items-center gap-2 border-b px-3">
                <SidebarTrigger />
                <span className="text-sm font-medium">Home</span>
              </header>
              <div className="p-4 text-sm text-muted-foreground">Your content goes here.</div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      ),
    },
  ],
});
