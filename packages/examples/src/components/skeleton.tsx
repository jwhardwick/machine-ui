import { Skeleton } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'skeleton',
  name: 'Skeleton',
  category: 'feedback',
  description: 'Placeholder blocks that hold the shape of content while it loads.',
  examples: [
    {
      name: 'Card',
      render: () => (
        <div className="flex w-full max-w-sm items-center gap-4" role="status" aria-label="Loading profile">
          <Skeleton className="size-12 rounded-full" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ),
    },
  ],
});
