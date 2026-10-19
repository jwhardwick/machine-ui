import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { disabledControl, fieldChrome, focusRing, transition } from '../lib/styles.ts';

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldChrome, transition, focusRing, disabledControl, 'min-h-20 resize-y px-3 py-2 text-base sm:text-sm', className)}
      {...props}
    />
  );
}
