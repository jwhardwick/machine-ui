'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { Button } from './button.tsx';

/** Code with a filename or language header and a copy button. */
export function CodeBlock({ code, filename, language, className, ...props }: ComponentProps<'div'> & { code: string; filename?: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div data-slot="code-block" className={cn('overflow-hidden rounded-lg border bg-muted text-sm', className)} {...props}>
      <div className="flex items-center justify-between border-b bg-card px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">{filename ?? language ?? 'code'}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
            } catch {
              return;
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-foreground" tabIndex={0}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
