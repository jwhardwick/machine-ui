import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'resizable',
  name: 'Resizable',
  category: 'layout',
  description: 'Panels the user can resize by dragging, or with arrow keys on the focused handle.',
  examples: [
    {
      name: 'Editor layout',
      wide: true,
      render: () => (
        <div className="h-64 w-full max-w-2xl overflow-hidden rounded-lg border">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={28} minSize={15} className="flex items-center justify-center bg-muted text-sm text-muted-foreground">
              Files
            </ResizablePanel>
            <ResizableHandle withHandle aria-label="Resize files panel" />
            <ResizablePanel defaultSize={72}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={65} className="flex items-center justify-center text-sm">
                  Editor
                </ResizablePanel>
                <ResizableHandle aria-label="Resize terminal" />
                <ResizablePanel defaultSize={35} className="flex items-center justify-center font-mono text-sm text-muted-foreground">
                  Terminal
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ),
    },
  ],
});
