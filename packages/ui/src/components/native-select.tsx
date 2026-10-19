import { ChevronDownIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { disabledControl, fieldChrome, focusRing, transition } from '../lib/styles.ts';

/** The browser's own select, styled to match. Best on mobile and for long option lists. */
export function NativeSelect({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div data-slot="native-select-wrapper" className="relative w-full">
      <select
        data-slot="native-select"
        className={cn(
          fieldChrome,
          transition,
          focusRing,
          disabledControl,
          'h-(--control-md) appearance-none pl-3 pr-8 text-sm',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}
