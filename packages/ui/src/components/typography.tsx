import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

export function H1({ className, ...props }: ComponentProps<'h1'>) {
  return <h1 className={cn('font-display text-4xl font-semibold leading-tight text-balance', className)} {...props} />;
}

export function H2({ className, ...props }: ComponentProps<'h2'>) {
  return <h2 className={cn('font-display text-3xl font-semibold leading-tight', className)} {...props} />;
}

export function H3({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 className={cn('font-display text-2xl font-semibold leading-snug', className)} {...props} />;
}

export function H4({ className, ...props }: ComponentProps<'h4'>) {
  return <h4 className={cn('font-display text-xl font-semibold leading-snug', className)} {...props} />;
}

export function P({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('leading-relaxed [&:not(:first-child)]:mt-4', className)} {...props} />;
}

export function Lead({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('text-xl text-muted-foreground', className)} {...props} />;
}

export function Muted({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function Blockquote({ className, ...props }: ComponentProps<'blockquote'>) {
  return <blockquote className={cn('mt-4 border-l-2 pl-4 italic', className)} {...props} />;
}

export function List({ className, ...props }: ComponentProps<'ul'>) {
  return <ul className={cn('my-4 ml-6 list-disc [&>li]:mt-2', className)} {...props} />;
}

export function InlineCode({ className, ...props }: ComponentProps<'code'>) {
  return <code className={cn('rounded-sm bg-muted px-1 py-0.5 font-mono text-sm', className)} {...props} />;
}
