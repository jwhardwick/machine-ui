'use client';

import { GripVerticalIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { cn } from '../lib/cn.ts';
import { focusRing } from '../lib/styles.ts';

export function ResizablePanelGroup({ className, ...props }: ComponentProps<typeof PanelGroup>) {
  return (
    <PanelGroup
      data-slot="resizable-panel-group"
      className={cn('flex size-full data-[panel-group-direction=vertical]:flex-col', className)}
      {...props}
    />
  );
}

export function ResizablePanel(props: ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" {...props} />;
}

export function ResizableHandle({ withHandle, className, ...props }: ComponentProps<typeof PanelResizeHandle> & { withHandle?: boolean }) {
  return (
    <PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
        'data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90',
        focusRing,
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVerticalIcon aria-hidden className="size-2.5" />
        </div>
      )}
    </PanelResizeHandle>
  );
}
