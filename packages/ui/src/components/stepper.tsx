import { CheckIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

export interface StepperStep {
  title: string;
  description?: string;
}

/** Progress through a fixed sequence of steps: done, current and upcoming. */
export function Stepper({
  steps,
  current,
  className,
  ...props
}: ComponentProps<'ol'> & { steps: StepperStep[]; current: number }) {
  return (
    <ol data-slot="stepper" className={cn('flex w-full flex-col gap-4 sm:flex-row sm:gap-2', className)} {...props}>
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming';
        return (
          <li
            key={step.title}
            data-state={state}
            aria-current={state === 'current' ? 'step' : undefined}
            className="group flex flex-1 items-start gap-3 sm:flex-col sm:gap-2"
          >
            <div className="flex w-full items-center gap-2">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
                  'group-data-[state=done]:border-primary group-data-[state=done]:bg-primary group-data-[state=done]:text-primary-foreground',
                  'group-data-[state=current]:border-primary group-data-[state=current]:text-foreground',
                  'group-data-[state=upcoming]:text-muted-foreground',
                )}
              >
                {state === 'done' ? <CheckIcon aria-hidden className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span aria-hidden className="hidden h-px flex-1 bg-border group-last:hidden sm:block group-data-[state=done]:bg-primary" />
            </div>
            <div className="grid gap-0.5">
              <span className="text-sm font-medium group-data-[state=upcoming]:text-muted-foreground">
                {step.title}
                <span className="sr-only">{state === 'done' ? ' (done)' : state === 'current' ? ' (current)' : ''}</span>
              </span>
              {step.description && <span className="text-xs text-muted-foreground">{step.description}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
