import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, Recharts, useReducedMotion, type ChartConfig } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

const DATA = [
  { month: 'May', visitors: 1860, signups: 420 },
  { month: 'Jun', visitors: 3050, signups: 610 },
  { month: 'Jul', visitors: 2370, signups: 530 },
  { month: 'Aug', visitors: 2730, signups: 690 },
  { month: 'Sep', visitors: 3490, signups: 880 },
  { month: 'Oct', visitors: 4120, signups: 1020 },
];

const config = {
  visitors: { label: 'Visitors', color: 'var(--chart-1)' },
  signups: { label: 'Sign-ups', color: 'var(--chart-2)' },
} satisfies ChartConfig;

// Chart animations run in JavaScript, so they follow the reduced-motion preference explicitly.
function BarExample() {
  const animate = !useReducedMotion();
  return (
    <ChartContainer config={config} className="h-64 w-full max-w-2xl" role="img" aria-label="Visitors and sign-ups by month, May to October">
      <Recharts.BarChart data={DATA} accessibilityLayer>
        <Recharts.CartesianGrid vertical={false} />
        <Recharts.XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} interval={0} minTickGap={0} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Recharts.Bar isAnimationActive={animate} dataKey="visitors" fill="var(--color-visitors)" radius={4} />
        <Recharts.Bar isAnimationActive={animate} dataKey="signups" fill="var(--color-signups)" radius={4} />
      </Recharts.BarChart>
    </ChartContainer>
  );
}

function AreaExample() {
  const animate = !useReducedMotion();
  return (
    <ChartContainer config={config} className="h-64 w-full max-w-2xl" role="img" aria-label="Visitors by month, rising from 1,860 to 4,120">
      <Recharts.AreaChart data={DATA} margin={{ left: 12, right: 12 }}>
        <Recharts.CartesianGrid vertical={false} />
        <Recharts.XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} interval={0} minTickGap={0} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Recharts.Area isAnimationActive={animate} dataKey="visitors" type="monotone" fill="var(--color-visitors)" fillOpacity={0.15} stroke="var(--color-visitors)" strokeWidth={2} />
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
