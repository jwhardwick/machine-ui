import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  DataTable,
  DataTableColumnHeader,
  Recharts,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  Stat,
  StatusDot,
  ToggleGroup,
  ToggleGroupItem,
  type ChartConfig,
  type ColumnDef,
  useReducedMotion,
} from '@machine-ui/ui';
import { BarChart3, Download, FolderGit2, GitPullRequest, Home, Settings, SquareTerminal } from 'lucide-react';

const ACTIVITY = [
  { day: 'Mon', sessions: 214, merged: 48 },
  { day: 'Tue', sessions: 258, merged: 52 },
  { day: 'Wed', sessions: 231, merged: 61 },
  { day: 'Thu', sessions: 302, merged: 64 },
  { day: 'Fri', sessions: 341, merged: 73 },
  { day: 'Sat', sessions: 187, merged: 22 },
  { day: 'Sun', sessions: 165, merged: 19 },
];

const TRIGGERS = [
  { trigger: 'Issues', share: 42 },
  { trigger: 'Chat', share: 27 },
  { trigger: 'CI', share: 16 },
  { trigger: 'Reviews', share: 10 },
  { trigger: 'Cron', share: 5 },
];

const activityConfig = {
  sessions: { label: 'Sessions', color: 'var(--chart-1)' },
  merged: { label: 'PRs merged', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const triggerConfig = { share: { label: 'Share of sessions (%)', color: 'var(--chart-3)' } } satisfies ChartConfig;

interface Run {
  id: string;
  repo: string;
  status: 'Merged' | 'Reverted' | 'Open';
  cost: number;
}

const RUNS: Run[] = [
  { id: 'RUN-3021', repo: 'machine-co/web', status: 'Merged', cost: 12.9 },
  { id: 'RUN-3020', repo: 'machine-co/api', status: 'Reverted', cost: 3.4 },
  { id: 'RUN-3019', repo: 'hooli/nucleus', status: 'Merged', cost: 27.6 },
  { id: 'RUN-3018', repo: 'machine-co/docs', status: 'Open', cost: 4.8 },
  { id: 'RUN-3017', repo: 'pied-piper/middle-out', status: 'Merged', cost: 51.2 },
  { id: 'RUN-3016', repo: 'machine-co/infra', status: 'Merged', cost: 8.6 },
];

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columns: ColumnDef<Run>[] = [
  { accessorKey: 'id', header: 'Run' },
  { accessorKey: 'repo', header: ({ column }) => <DataTableColumnHeader column={column} title="Repository" /> },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<Run['status']>();
      return <Badge variant={status === 'Reverted' ? 'destructive' : status === 'Open' ? 'outline' : 'secondary'}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'cost',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cost" />,
    cell: ({ getValue }) => <span className="tabular-nums">{currency.format(getValue<number>())}</span>,
  },
];

const NAV = [
  { label: 'Overview', icon: Home, active: true },
  { label: 'Sessions', icon: SquareTerminal, badge: '12' },
  { label: 'Pull requests', icon: GitPullRequest },
  { label: 'Repositories', icon: FolderGit2 },
  { label: 'Usage', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
];

/** An agent usage dashboard with stats, charts, a sortable table of runs, and runner status. */
export function DashboardScreen() {
  // Chart animations run in JavaScript, so they follow the reduced-motion preference explicitly.
  const animate = !useReducedMotion();
  return (
    <SidebarProvider className="h-full">
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-8 items-center gap-2 px-2 font-display font-semibold group-data-[collapsible=icon]/sidebar:hidden">machine-co</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
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
      </Sidebar>
      <SidebarInset className="min-h-0 overflow-y-auto">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#usage">Usage</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <ToggleGroup type="single" defaultValue="7d" variant="outline" size="sm" aria-label="Date range">
              <ToggleGroupItem value="24h">24h</ToggleGroupItem>
              <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
              <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
            </ToggleGroup>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <Download aria-hidden /> Export
            </Button>
          </div>
        </header>

        <div className="grid gap-4 p-4">
          <h2 className="sr-only">Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Sessions', value: '1,698', change: '8.1%', trend: 'up' as const },
              { label: 'PRs merged', value: '339', change: '12.4%', trend: 'up' as const },
              { label: 'Merged unchanged', value: '86%', change: '2.1pt', trend: 'up' as const },
              { label: 'Revert rate', value: '1.2%', change: '0.3pt', trend: 'down' as const },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <Stat {...stat} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Sessions and merges</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={activityConfig} className="h-56 w-full" role="img" aria-label="Sessions peaked on Friday at 341, with 73 pull requests merged. Both dropped at the weekend.">
                  <Recharts.AreaChart data={ACTIVITY} margin={{ left: 16, right: 16 }}>
                    <Recharts.CartesianGrid vertical={false} />
                    <Recharts.XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} interval={0} minTickGap={0} />
                    {/* Merges are a fraction of sessions, so each series gets its own scale. */}
                    <Recharts.YAxis yAxisId="sessions" hide />
                    <Recharts.YAxis yAxisId="merged" orientation="right" hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Recharts.Area isAnimationActive={animate} yAxisId="sessions" dataKey="sessions" type="monotone" fill="var(--color-sessions)" fillOpacity={0.12} stroke="var(--color-sessions)" strokeWidth={2} />
                    <Recharts.Area isAnimationActive={animate} yAxisId="merged" dataKey="merged" type="monotone" fill="var(--color-merged)" fillOpacity={0.08} stroke="var(--color-merged)" strokeWidth={2} strokeDasharray="4 3" />
                  </Recharts.AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What started each session</CardTitle>
                <CardDescription>Share of sessions, %</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={triggerConfig} className="h-56 w-full" role="img" aria-label="Issues start 42% of sessions, then chat 27%, CI failures 16%, reviews 10%, and scheduled runs 5%">
                  <Recharts.BarChart data={TRIGGERS} layout="vertical" margin={{ left: 8 }}>
                    <Recharts.XAxis type="number" hide />
                    <Recharts.YAxis dataKey="trigger" type="category" tickLine={false} axisLine={false} width={64} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Recharts.Bar isAnimationActive={animate} dataKey="share" fill="var(--color-share)" radius={4} />
                  </Recharts.BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Recent runs</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={RUNS} pageSize={5} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Runner status</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 text-sm">
                  <li className="flex items-center gap-2">
                    <StatusDot tone="online" /> Agent runners <span className="ml-auto text-muted-foreground">Operational</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <StatusDot tone="online" /> Model API <span className="ml-auto text-muted-foreground">Operational</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <StatusDot tone="busy" /> Preview deploys <span className="ml-auto text-muted-foreground">Delayed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <StatusDot tone="online" /> GitHub sync <span className="ml-auto text-muted-foreground">Operational</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
