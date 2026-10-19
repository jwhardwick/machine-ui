'use client';

import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Types text out a few characters at a time with a cursor, then hides the cursor.
 * Shows the full text at once for people who prefer reduced motion. Screen readers get the
 * finished text only (aria-busy while streaming).
 */
export function StreamingText({
  text,
  speed = 24,
  onDone,
  className,
  ...props
}: ComponentProps<'span'> & { text: string; speed?: number; onDone?: () => void }) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? text.length : 0));
  const done = shown >= text.length;
  const onDoneRef = useRef(onDone);
  const reported = useRef(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (done) {
      if (!reported.current) {
        reported.current = true;
        onDoneRef.current?.();
      }
      return;
    }
    const id = window.setTimeout(() => setShown((n) => Math.min(text.length, n + 3)), 1000 / speed);
    return () => window.clearTimeout(id);
  }, [done, shown, speed, text.length]);

  return (
    <span data-slot="streaming-text" aria-busy={!done} className={cn('whitespace-pre-wrap', className)} {...props}>
      {text.slice(0, shown)}
      {!done && <span aria-hidden className="ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-0.5 animate-caret bg-current" />}
    </span>
  );
}
