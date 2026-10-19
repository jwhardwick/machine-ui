import { Separator } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'separator',
  name: 'Separator',
  category: 'layout',
  description: 'A hairline between groups of content, horizontal or vertical.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="w-full max-w-xs text-sm">
          <p className="font-medium">machine-ui</p>
          <p className="text-muted-foreground">Themes that look like yours.</p>
          <Separator className="my-4" />
          <div className="flex h-5 items-center gap-3">
            <span>Docs</span>
            <Separator orientation="vertical" />
            <span>Themes</span>
            <Separator orientation="vertical" />
            <span>Changelog</span>
          </div>
        </div>
      ),
    },
  ],
});
