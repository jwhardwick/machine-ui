'use client';

import type { CSSProperties } from 'react';
import { Toaster as Sonner, toast, type ToasterProps } from 'sonner';

/** Toast queue. Mount once near the root; call `toast()` from anywhere. Colours come from the theme. */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'var(--popover)',
          '--success-text': 'var(--popover-foreground)',
          '--success-border': 'var(--success)',
          '--error-bg': 'var(--popover)',
          '--error-text': 'var(--popover-foreground)',
          '--error-border': 'var(--destructive)',
          '--border-radius': 'var(--corner-md)',
          fontFamily: 'var(--typeface-text)',
        } as CSSProperties
      }
      {...props}
    />
  );
}

export { toast };
