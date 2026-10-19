import { SparklesIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

/** The agent's mark, used as its avatar beside messages and activity. */
export function AgentGlyph({ className, label = 'Assistant', ...props }: ComponentProps<'span'> & { label?: string }) {
  return (
    <span
      data-slot="agent-glyph"
      role="img"
      aria-label={label}
      className={cn('inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground [&_svg]:size-1/2', className)}
      {...props}
    >
      <SparklesIcon aria-hidden />
    </span>
  );
}
