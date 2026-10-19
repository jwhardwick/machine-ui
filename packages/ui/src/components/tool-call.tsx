import { CheckIcon, ChevronRightIcon, TriangleAlertIcon, WrenchIcon } from 'lucide-react';
import { useId, useState, type ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing } from '../lib/styles.ts';
import { Spinner } from './spinner.tsx';

/** A tool the agent called: name, status, and its input and output on demand. */
export function ToolCall({
  name,
  status,
  input,
  output,
  defaultOpen = false,
  className,
  ...props
}: ComponentProps<'div'> & { name: string; status: 'running' | 'done' | 'error'; input?: string; output?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div data-slot="tool-call" data-status={status} className={cn('rounded-lg border bg-card text-sm', className)} {...props}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className={cn('flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left', focusRing)}
      >
        <WrenchIcon aria-hidden className="size-3.5 text-muted-foreground" />
        <span className="font-mono text-xs">{name}</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          {status === 'running' && <Spinner className="size-3.5" aria-label="Running" />}
          {status === 'done' && <CheckIcon aria-hidden className="size-3.5 text-success" />}
          {status === 'error' && <TriangleAlertIcon aria-hidden className="size-3.5 text-destructive" />}
          {status === 'running' ? 'Running' : status === 'done' ? 'Done' : 'Failed'}
        </span>
        <ChevronRightIcon aria-hidden className={cn('size-4 text-muted-foreground transition-transform duration-(--motion-fast)', open && 'rotate-90')} />
      </button>
      {open && (
        <div id={id} className="grid gap-2 border-t px-3 py-2">
          {input && (
            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">Input</span>
              <pre className="overflow-x-auto rounded-md bg-muted p-2 font-mono text-xs text-foreground">{input}</pre>
            </div>
          )}
          {output && (
            <div className="grid gap-1">
              <span className="text-xs text-muted-foreground">Output</span>
              <pre className="overflow-x-auto rounded-md bg-muted p-2 font-mono text-xs text-foreground">{output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
