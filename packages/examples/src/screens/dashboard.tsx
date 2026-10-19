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
import { BarChart3, Download, Home, Package, Settings, ShoppingCart, Users } from 'lucide-react';

const TRAFFIC = [
  { day: 'Mon', visitors: 2140, orders: 168 },
  { day: 'Tue', visitors: 2580, orders: 181 },
  { day: 'Wed', visitors: 2310, orders: 203 },
  { day: 'Thu', visitors: 3020, orders: 214 },
  { day: 'Fri', visitors: 3410, orders: 248 },
  { day: 'Sat', visitors: 2870, orders: 309 },
  { day: 'Sun', visitors: 2650, orders: 288 },
];

const CHANNELS = [
  { channel: 'Search', share: 42 },
  { channel: 'Direct', share: 27 },
  { channel: 'Email', share: 16 },
  { channel: 'Social', share: 10 },
  { channel: 'Referral', share: 5 },
];

const trafficConfig = {
  visitors: { label: 'Visitors', color: 'var(--chart-1)' },
  orders: { label: 'Orders', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const channelConfig = { share: { label: 'Share of orders (%)', color: 'var(--chart-3)' } } satisfies ChartConfig;

interface Order {
  id: string;
  customer: string;
  status: 'Paid' | 'Refunded' | 'Pending';
  total: number;
}

const ORDERS: Order[] = [
  { id: 'NW-3021', customer: 'Lumen Labs', status: 'Paid', total: 1290 },
  { id: 'NW-3020', customer: 'Fjord Health', status: 'Refunded', total: 340 },
  { id: 'NW-3019', customer: 'Brightline', status: 'Paid', total: 2760 },
  { id: 'NW-3018', customer: 'Cobalt Dental', status: 'Pending', total: 480 },
  { id: 'NW-3017', customer: 'Acme', status: 'Paid', total: 5120 },
  { id: 'NW-3016', customer: 'Northwind', status: 'Paid', total: 860 },
];

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const columns: ColumnDef<Order>[] = [
  { accessorKey: 'id', header: 'Order' },
  { accessorKey: 'customer', header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" /> },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<Order['status']>();
      return <Badge variant={status === 'Refunded' ? 'destructive' : status === 'Pending' ? 'outline' : 'secondary'}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
    cell: ({ getValue }) => <span className="tabular-nums">{currency.format(getValue<number>())}</span>,
  },
];

const NAV = [
  { label: 'Overview', icon: Home, active: true },
  { label: 'Orders', icon: ShoppingCart, badge: '12' },
  { label: 'Products', icon: Package },
  { label: 'Customers', icon: Users },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
];

/** A store analytics dashboard: stats, charts, a sortable table and system status. */
export function DashboardScreen() {
  // Chart animations run in JavaScript, so they follow the reduced-motion preference explicitly.
  const animate = !useReducedMotion();
  return (
    <SidebarProvider className="h-full">
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-8 items-center gap-2 px-2 font-display font-semibold group-data-[collapsible=icon]/sidebar:hidden">Northwind store</div>
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
                <BreadcrumbLink href="#store">Store</BreadcrumbLink>
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
              { label: 'Revenue', value: '$48,210', change: '12.4%', trend: 'up' as const },
              { label: 'Orders', value: '1,631', change: '8.1%', trend: 'up' as const },
              { label: 'Conversion', value: '3.9%', change: '0.4pt', trend: 'up' as const },
              { label: 'Refund rate', value: '1.2%', change: '0.3pt', trend: 'down' as const },
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
                <CardTitle className="text-base">Traffic and orders</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={trafficConfig} className="h-56 w-full" role="img" aria-label="Visitors peaked Friday at 3,410; orders kept climbing to a Saturday peak of 309">
                  <Recharts.AreaChart data={TRAFFIC} margin={{ left: 16, right: 16 }}>
                    <Recharts.CartesianGrid vertical={false} />
                    <Recharts.XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} interval={0} minTickGap={0} />
                    {/* Orders are an order of magnitude smaller, so each series gets its own scale. */}
                    <Recharts.YAxis yAxisId="visitors" hide />
                    <Recharts.YAxis yAxisId="orders" orientation="right" hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Recharts.Area isAnimationActive={animate} yAxisId="visitors" dataKey="visitors" type="monotone" fill="var(--color-visitors)" fillOpacity={0.12} stroke="var(--color-visitors)" strokeWidth={2} />
                    <Recharts.Area isAnimationActive={animate} yAxisId="orders" dataKey="orders" type="monotone" fill="var(--color-orders)" fillOpacity={0.08} stroke="var(--color-orders)" strokeWidth={2} strokeDasharray="4 3" />
                  </Recharts.AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Orders by channel</CardTitle>
                <CardDescription>Share of orders, %</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={channelConfig} className="h-56 w-full" role="img" aria-label="Search drives 42% of orders, then direct 27%, email 16%, social 10%, referral 5%">
                  <Recharts.BarChart data={CHANNELS} layout="vertical" margin={{ left: 8 }}>
                    <Recharts.XAxis type="number" hide />
                    <Recharts.YAxis dataKey="channel" type="category" tickLine={false} axisLine={false} width={64} />
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
                <CardTitle className="text-base">Recent orders</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={ORDERS} pageSize={5} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System status</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 text-sm">
                  <li className="flex items-center gap-2">
                    <StatusDot tone="online" /> Checkout <span className="ml-auto text-muted-foreground">Operational</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <StatusDot tone="online" /> Payments <span className="ml-auto text-muted-foreground">Operational</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <StatusDot tone="busy" /> Email receipts <span className="ml-auto text-muted-foreground">Delayed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <StatusDot tone="online" /> Search <span className="ml-auto text-muted-foreground">Operational</span>
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
