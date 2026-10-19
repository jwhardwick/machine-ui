import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@machine-ui/ui';
import { ChevronsUpDown } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'collapsible',
  name: 'Collapsible',
  category: 'layout',
  description: 'A single trigger that shows or hides the content beneath it.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <Collapsible className="grid w-full max-w-xs gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">3 files changed</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle file list">
                <ChevronsUpDown aria-hidden />
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="rounded-md border px-3 py-2 font-mono text-sm">packages/ui/src/button.tsx</div>
          <CollapsibleContent className="grid gap-2">
            <div className="rounded-md border px-3 py-2 font-mono text-sm">packages/tokens/theme.css</div>
            <div className="rounded-md border px-3 py-2 font-mono text-sm">docs/decisions/0002.md</div>
          </CollapsibleContent>
        </Collapsible>
      ),
    },
  ],
});
