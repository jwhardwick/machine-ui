import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

const alertVariants = cva(
  [
    'grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border bg-card px-4 py-3 text-sm text-card-foreground',
    'has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5',
  ],
  {
  variants: {
    variant: {
      default: 'border-border [&>svg]:text-muted-foreground',
      success: 'border-success [&>svg]:text-success',
      warning: 'border-warning [&>svg]:text-warning',
      destructive: 'border-destructive text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
  },
);

export interface AlertProps extends ComponentProps<'div'>, VariantProps<typeof alertVariants> {}

/** Destructive and warning alerts interrupt (`role="alert"`); default alerts are polite (`role="status"`). */
export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role={variant === 'destructive' || variant === 'warning' ? 'alert' : 'status'}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="alert-title" className={cn('col-start-2 font-medium leading-tight', className)} {...props} />;
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="alert-description" className={cn('col-start-2 text-muted-foreground', className)} {...props} />;
}
