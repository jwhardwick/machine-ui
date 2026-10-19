import { Button, Spinner } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'spinner',
  name: 'Spinner',
  category: 'feedback',
  description: 'A spinning ring for work with no known length. Announced to screen readers as loading.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="flex items-center gap-6">
          <Spinner />
          <Spinner className="size-6" />
          <Button disabled>
            <Spinner /> Saving
          </Button>
        </div>
      ),
    },
  ],
});
