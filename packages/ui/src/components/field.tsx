import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { Label } from './label.tsx';

/** Groups a label, control, description and error for one form field. */
export function Field({
  className,
  orientation = 'vertical',
  ...props
}: ComponentProps<'div'> & { orientation?: 'vertical' | 'horizontal' }) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        'group/field flex w-full gap-2 data-[invalid=true]:text-destructive',
        orientation === 'vertical' ? 'flex-col' : 'flex-row items-center [&>[data-slot=field-label]]:flex-auto',
        className,
      )}
      {...props}
    />
  );
}

export function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn('group-data-[disabled=true]/field:opacity-50', className)} {...props} />;
}

export function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="field-description" className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function FieldError({ className, children, ...props }: ComponentProps<'p'>) {
  if (!children) return null;
  return (
    <p role="alert" data-slot="field-error" className={cn('text-sm text-destructive', className)} {...props}>
      {children}
    </p>
  );
}

export function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field-group" className={cn('flex w-full flex-col gap-6', className)} {...props} />;
}

export function FieldSet({ className, ...props }: ComponentProps<'fieldset'>) {
  return <fieldset data-slot="field-set" className={cn('flex flex-col gap-4', className)} {...props} />;
}

export function FieldLegend({ className, ...props }: ComponentProps<'legend'>) {
  return <legend data-slot="field-legend" className={cn('mb-1 font-medium', className)} {...props} />;
}
