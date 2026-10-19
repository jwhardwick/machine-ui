import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

const alertVariants = cva('grid w-full gap-1 rounded-lg border bg-card px-4 py-3 text-sm', {
  variants: {
    variant: {
      default: 'border-border text-card-foreground',
      destructive: 'border-destructive text-destructive',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface AlertProps extends ComponentProps<'div'>, VariantProps<typeof alertVariants> {}

/** Destructive alerts interrupt (`role="alert"`); default alerts are polite (`role="status"`). */
export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role={variant === 'destructive' ? 'alert' : 'status'}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="alert-title" className={cn('font-medium leading-tight', className)} {...props} />;
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="alert-description" className={cn('text-muted-foreground', className)} {...props} />;
}
