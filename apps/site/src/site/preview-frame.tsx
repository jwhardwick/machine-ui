import { cn } from '@machine-ui/ui';
import type { ComponentProps } from 'react';

/** A framed stage for live previews, on a faint dot grid so components read as objects. */
export function PreviewFrame({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative flex min-h-48 items-center justify-center overflow-hidden rounded-xl border bg-background p-6 sm:p-10',
        'bg-[radial-gradient(color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px)] bg-[size:1rem_1rem]',
        className,
      )}
      {...props}
    />
  );
}

/** A browser-window frame for whole screens. */
export function ScreenFrame({ title, className, children, ...props }: ComponentProps<'div'> & { title: string }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border bg-background shadow-lg', className)} {...props}>
      <div className="flex h-9 items-center gap-2 border-b bg-muted px-3" aria-hidden>
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </span>
        <span className="mx-auto rounded-md bg-background px-3 py-0.5 font-mono text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="relative h-[42rem] [&_[data-slot=sidebar-wrapper]]:min-h-0">{children}</div>
    </div>
  );
}
