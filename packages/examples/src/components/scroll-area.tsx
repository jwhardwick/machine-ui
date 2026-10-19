import { ScrollArea, ScrollBar, Separator } from '@machine-ui/ui';
import { Fragment } from 'react';
import { defineDoc } from '../types.ts';

const RELEASES = Array.from({ length: 24 }, (_, i) => `v2.${24 - i}.0`);

export default defineDoc({
  slug: 'scroll-area',
  name: 'Scroll Area',
  category: 'layout',
  description: 'A fixed-height container that scrolls its content with a thin, theme-coloured scrollbar.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <ScrollArea className="h-56 w-48 rounded-md border" role="region" aria-label="Releases">
          <div className="p-4">
            <p className="mb-3 text-sm font-medium">Releases</p>
            {RELEASES.map((tag) => (
              <Fragment key={tag}>
                <div className="font-mono text-sm">{tag}</div>
                <Separator className="my-2" />
              </Fragment>
            ))}
          </div>
        </ScrollArea>
      ),
    },
    {
      name: 'Horizontal',
      render: () => (
        <ScrollArea className="w-72 whitespace-nowrap rounded-md border" role="region" aria-label="Recent themes">
          <div className="flex gap-3 p-4">
            {['graphite', 'harbor', 'folio', 'console', 'bloom', 'forge', 'custom-1', 'custom-2'].map((name) => (
              <div key={name} className="flex h-20 w-28 shrink-0 items-end rounded-md bg-muted p-2 text-sm">
                {name}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ),
    },
  ],
});
