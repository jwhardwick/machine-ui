import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

/** One turn in a conversation. User turns sit right in a bubble; assistant turns read as plain text. */
export function Message({ from, className, ...props }: ComponentProps<'div'> & { from: 'user' | 'assistant' }) {
  return (
    <div
      data-slot="message"
      data-from={from}
      className={cn('group/message flex w-full gap-3', from === 'user' ? 'justify-end' : 'justify-start', className)}
      {...props}
    />
  );
}

export function MessageContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        'grid min-w-0 gap-2 text-sm leading-relaxed',
        'group-data-[from=user]/message:max-w-[80%] group-data-[from=user]/message:rounded-xl group-data-[from=user]/message:bg-secondary group-data-[from=user]/message:px-4 group-data-[from=user]/message:py-2.5 group-data-[from=user]/message:text-secondary-foreground',
        'group-data-[from=assistant]/message:flex-1',
        className,
      )}
      {...props}
    />
  );
}

/** Hover actions under an assistant turn: copy, retry, feedback. Always reachable by keyboard. */
export function MessageActions({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-actions"
      className={cn(
        'flex items-center gap-1 text-muted-foreground opacity-0 transition-opacity duration-(--motion-fast) group-hover/message:opacity-100 focus-within:opacity-100',
        className,
      )}
      {...props}
    />
  );
}
