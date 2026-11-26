import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@machine-ui/ui';
import { CircleAlert, CircleCheck, Info, Plus, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * What the Figma importer builds as components. Each spec lists its variant axes; the extractor
 * renders every combination and the plugin combines them into one component set.
 *
 * Specs are separate from the docs examples on purpose: an example shows several variants side by
 * side, a Figma variant is exactly one.
 */
export interface FigmaSpec {
  key: string;
  name: string;
  group: string;
  axes: Record<string, readonly string[]>;
  /** Width of the frame it renders in. Components that fill their container need one. */
  width?: number;
  /** Skip combinations that don't exist, e.g. a disabled link button. */
  skip?: (props: Record<string, string>) => boolean;
  render: (props: Record<string, string>) => ReactNode;
}

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';
type AlertVariant = 'default' | 'success' | 'warning' | 'destructive';

const ALERT_ICONS: Record<AlertVariant, ReactNode> = {
  default: <Info aria-hidden />,
  success: <CircleCheck aria-hidden />,
  warning: <TriangleAlert aria-hidden />,
  destructive: <CircleAlert aria-hidden />,
};

const ALERT_COPY: Record<AlertVariant, [string, string]> = {
  default: ['Machine 4.1 is out', 'Restart your running sessions to use it.'],
  success: ['Pull request merged', 'Pull request #482 is on main.'],
  warning: ['Usage at 90%', 'You have 2,000 agent minutes left this month.'],
  destructive: ['Deploy failed', 'The build step exited with code 1.'],
};

export const FIGMA_SPECS: FigmaSpec[] = [
  {
    key: 'button',
    name: 'Button',
    group: 'Forms',
    axes: {
      variant: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
      size: ['sm', 'md', 'lg', 'icon'],
      state: ['default', 'disabled'],
    },
    skip: ({ variant, size }) => variant === 'link' && size === 'icon',
    render: ({ variant, size, state }) => (
      <Button variant={variant as ButtonVariant} size={size as ButtonSize} disabled={state === 'disabled'} aria-label={size === 'icon' ? 'Add' : undefined}>
        {size === 'icon' ? <Plus aria-hidden /> : 'Run agent'}
      </Button>
    ),
  },
  {
    key: 'badge',
    name: 'Badge',
    group: 'Data display',
    axes: { variant: ['default', 'secondary', 'outline', 'destructive'] },
    render: ({ variant }) => <Badge variant={variant as BadgeVariant}>Merged</Badge>,
  },
  {
    key: 'input',
    name: 'Input',
    group: 'Forms',
    axes: { state: ['placeholder', 'filled', 'disabled', 'invalid'] },
    width: 320,
    render: ({ state }) => (
      <Input
        aria-label="Repository"
        placeholder="org/repository"
        defaultValue={state === 'placeholder' ? undefined : 'piedpiper/middle-out'}
        disabled={state === 'disabled'}
        aria-invalid={state === 'invalid' || undefined}
      />
    ),
  },
  {
    key: 'card',
    name: 'Card',
    group: 'Data display',
    axes: { footer: ['true', 'false'] },
    width: 384,
    render: ({ footer }) => (
      <Card>
        <CardHeader>
          <CardTitle>Weekly agent report</CardTitle>
          <CardDescription>Sessions and pull requests for week 43.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">The agent opened 38 pull requests. 31 merged without changes.</CardContent>
        {footer === 'true' && (
          <CardFooter className="gap-2">
            <Button size="sm">Open report</Button>
            <Button size="sm" variant="ghost">
              Share
            </Button>
          </CardFooter>
        )}
      </Card>
    ),
  },
  {
    key: 'alert',
    name: 'Alert',
    group: 'Feedback',
    axes: { variant: ['default', 'success', 'warning', 'destructive'] },
    width: 480,
    render: ({ variant }) => {
      const v = variant as AlertVariant;
      return (
        <Alert variant={v}>
          {ALERT_ICONS[v]}
          <AlertTitle>{ALERT_COPY[v][0]}</AlertTitle>
          <AlertDescription>{ALERT_COPY[v][1]}</AlertDescription>
        </Alert>
      );
    },
  },
];

/** Every combination of a spec's axes, minus the skipped ones. */
export function combinations(spec: FigmaSpec): Record<string, string>[] {
  let out: Record<string, string>[] = [{}];
  for (const [axis, values] of Object.entries(spec.axes)) {
    out = out.flatMap((combo) => values.map((value) => ({ ...combo, [axis]: value })));
  }
  return spec.skip ? out.filter((c) => !spec.skip!(c)) : out;
}
