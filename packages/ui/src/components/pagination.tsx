import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { buttonVariants, type ButtonProps } from './button.tsx';

export function Pagination({ className, ...props }: ComponentProps<'nav'>) {
  return <nav aria-label="Pagination" data-slot="pagination" className={cn('mx-auto flex w-full justify-center', className)} {...props} />;
}

export function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
  return <ul data-slot="pagination-content" className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

export function PaginationItem(props: ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

export function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: ComponentProps<'a'> & { isActive?: boolean; size?: ButtonProps['size'] }) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }), className)}
      {...props}
    />
  );
}

export function PaginationPrevious({ className, ...props }: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to previous page" size="md" className={cn('gap-1 px-2.5', className)} {...props}>
      <ChevronLeftIcon aria-hidden />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

export function PaginationNext({ className, ...props }: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to next page" size="md" className={cn('gap-1 px-2.5', className)} {...props}>
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon aria-hidden />
    </PaginationLink>
  );
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span aria-hidden data-slot="pagination-ellipsis" className={cn('flex size-(--control-md) items-center justify-center', className)} {...props}>
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
