'use client';

import { createContext, useContext, useId, type CSSProperties, type ComponentProps, type ReactNode } from 'react';
import * as Recharts from 'recharts';
import { cn } from '../lib/cn.ts';

/** Series key → label and colour. Colours should be tokens, e.g. `var(--chart-1)`. */
export type ChartConfig = Record<string, { label: ReactNode; color: string }>;

const ChartContext = createContext<ChartConfig | null>(null);

function useChart() {
  const config = useContext(ChartContext);
  if (!config) throw new Error('Chart parts must be used inside <ChartContainer>');
  return config;
}

/**
 * Sizes a recharts chart to its container and exposes each series colour as
 * `--color-<key>`, so marks use `fill="var(--color-revenue)"` and follow the theme.
 */
export function ChartContainer({
  config,
  className,
  children,
  style,
  ...props
}: ComponentProps<'div'> & { config: ChartConfig; children: ComponentProps<typeof Recharts.ResponsiveContainer>['children'] }) {
  const id = useId();
  const vars = Object.fromEntries(Object.entries(config).map(([key, { color }]) => [`--color-${key}`, color]));
  return (
    <ChartContext.Provider value={config}>
      <div
        data-slot="chart"
        data-chart={id}
        style={{ ...vars, ...style } as CSSProperties}
        className={cn(
          'flex aspect-video justify-center text-xs',
          '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border',
          '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted',
          '[&_.recharts-polar-grid_[stroke]]:stroke-border [&_.recharts-reference-line_[stroke]]:stroke-border',
          '[&_.recharts-layer]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-sector]:outline-none',
          className,
        )}
        {...props}
      >
        <Recharts.ResponsiveContainer>{children}</Recharts.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = Recharts.Tooltip;
export const ChartLegend = Recharts.Legend;

interface TooltipPayloadItem {
  dataKey?: string | number;
  name?: string | number;
  value?: number | string;
  color?: string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: ReactNode;
  hideLabel?: boolean;
}) {
  const config = useChart();
  if (!active || !payload?.length) return null;
  return (
    <div className="grid min-w-32 gap-1.5 rounded-md border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md">
      {!hideLabel && label != null && <div className="font-medium">{label}</div>}
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.name);
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-sm" style={{ background: item.color ?? `var(--color-${key})` }} />
            <span className="text-muted-foreground">{config[key]?.label ?? key}</span>
            <span className="ml-auto font-mono font-medium tabular-nums">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ChartLegendContent({ payload }: { payload?: { dataKey?: string | number; value?: string; color?: string }[] }) {
  const config = useChart();
  if (!payload?.length) return null;
  return (
    <div className="flex items-center justify-center gap-4 pt-3">
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.value);
        return (
          <div key={key} className="flex items-center gap-1.5">
            <span className="size-2 shrink-0 rounded-sm" style={{ background: item.color }} />
            {config[key]?.label ?? key}
          </div>
        );
      })}
    </div>
  );
}

export { Recharts };
