import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, Recharts, useReducedMotion, type ChartConfig } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

const DATA = [
  { month: 'May', sessions: 1860, merged: 420 },
  { month: 'Jun', sessions: 3050, merged: 610 },
  { month: 'Jul', sessions: 2370, merged: 530 },
  { month: 'Aug', sessions: 2730, merged: 690 },
  { month: 'Sep', sessions: 3490, merged: 880 },
  { month: 'Oct', sessions: 4120, merged: 1020 },
];

const config = {
  sessions: { label: 'Sessions', color: 'var(--chart-1)' },
  merged: { label: 'PRs merged', color: 'var(--chart-2)' },
} satisfies ChartConfig;

// Chart animations run in JavaScript, so they follow the reduced-motion preference explicitly.
function BarExample() {
  const animate = !useReducedMotion();
  return (
    <ChartContainer config={config} className="h-64 w-full max-w-2xl" role="img" aria-label="Agent sessions and merged pull requests by month, May to October">
      <Recharts.BarChart data={DATA} accessibilityLayer>
        <Recharts.CartesianGrid vertical={false} />
        <Recharts.XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} interval={0} minTickGap={0} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Recharts.Bar isAnimationActive={animate} dataKey="sessions" fill="var(--color-sessions)" radius={4} />
        <Recharts.Bar isAnimationActive={animate} dataKey="merged" fill="var(--color-merged)" radius={4} />
      </Recharts.BarChart>
    </ChartContainer>
  );
}

function AreaExample() {
  const animate = !useReducedMotion();
  return (
    <ChartContainer config={config} className="h-64 w-full max-w-2xl" role="img" aria-label="Agent sessions by month, rising from 1,860 to 4,120">
      <Recharts.AreaChart data={DATA} margin={{ left: 12, right: 12 }}>
        <Recharts.CartesianGrid vertical={false} />
        <Recharts.XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} interval={0} minTickGap={0} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Recharts.Area isAnimationActive={animate} dataKey="sessions" type="monotone" fill="var(--color-sessions)" fillOpacity={0.15} stroke="var(--color-sessions)" strokeWidth={2} />
      </Recharts.AreaChart>
    </ChartContainer>
  );
}

export default defineDoc({
  slug: 'chart',
  name: 'Chart',
  category: 'data',
  description: 'Recharts charts with theme colours, gridlines, and tooltips. Series colours come from the chart tokens.',
  examples: [
    {
      name: 'Bar',
      wide: true,
      render: () => <BarExample />,
    },
    {
      name: 'Area',
      wide: true,
      render: () => <AreaExample />,
    },
  ],
});
