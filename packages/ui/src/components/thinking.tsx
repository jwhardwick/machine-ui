import { CheckIcon, CircleIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { Spinner } from './spinner.tsx';

/** A short label with three pulsing dots while the agent works. Still when motion is off. */
export function ThinkingIndicator({ label = 'Thinking', className, ...props }: ComponentProps<'div'> & { label?: string }) {
  return (
    <div data-slot="thinking-indicator" role="status" className={cn('inline-flex items-center gap-2 text-sm text-muted-foreground', className)} {...props}>
      <span>{label}</span>
      <span aria-hidden className="inline-flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-dot rounded-full bg-current"
            style={{ animationDelay: `calc(var(--motion-normal) * ${i})` }}
          />
        ))}
      </span>
    </div>
  );
}

export interface ThinkingStep {
  label: string;
  detail?: string;
  state: 'done' | 'active' | 'upcoming';
}

/** The steps an agent is working through, with done, active and upcoming states. */
export function ThinkingSteps({ steps, className, ...props }: ComponentProps<'ol'> & { steps: ThinkingStep[] }) {
  return (
    <ol data-slot="thinking-steps" aria-label="Agent progress" className={cn('grid gap-2 text-sm', className)} {...props}>
      {steps.map((step) => (
        <li key={step.label} data-state={step.state} className="group flex items-start gap-2">
          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center text-muted-foreground group-data-[state=done]:text-success">
            {step.state === 'done' ? (
              <CheckIcon aria-hidden className="size-4" strokeWidth={2.5} />
            ) : step.state === 'active' ? (
              <Spinner className="size-3.5 text-foreground" aria-label="In progress" />
            ) : (
              <CircleIcon aria-hidden className="size-2.5" />
            )}
          </span>
          <span className="grid gap-0.5">
            <span className="group-data-[state=active]:font-medium group-data-[state=upcoming]:text-muted-foreground">
              {step.label}
              <span className="sr-only">{step.state === 'done' ? ' (done)' : step.state === 'active' ? ' (in progress)' : ' (to do)'}</span>
            </span>
            {step.detail && <span className="font-mono text-xs text-muted-foreground">{step.detail}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
