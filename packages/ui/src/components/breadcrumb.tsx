'use client';

import { ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

export function Breadcrumb(props: ComponentProps<'nav'>) {
  return <nav aria-label="Breadcrumb" data-slot="breadcrumb" {...props} />;
}

export function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return <ol data-slot="breadcrumb-list" className={cn('flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground', className)} {...props} />;
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return <li data-slot="breadcrumb-item" className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}

export function BreadcrumbLink({ asChild, className, ...props }: ComponentProps<'a'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'a';
  return <Comp data-slot="breadcrumb-link" className={cn('transition-colors hover:text-foreground', className)} {...props} />;
}

export function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="breadcrumb-page" aria-current="page" className={cn('font-normal text-foreground', className)} {...props} />;
}

export function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<'li'>) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden className={cn('[&>svg]:size-3.5', className)} {...props}>
      {children ?? <ChevronRightIcon />}
    </li>
  );
}

export function BreadcrumbEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden className={cn('flex size-5 items-center justify-center', className)} {...props}>
      <MoreHorizontalIcon className="size-4" />
    </span>
  );
}
