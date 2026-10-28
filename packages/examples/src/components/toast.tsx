import { Button, Toaster, toast } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'toast',
  name: 'Toast',
  category: 'feedback',
  description: 'Short, temporary messages in a stack. Mount one Toaster near the root and call toast() from anywhere.',
  examples: [
    {
      name: 'Variants',
      render: () => (
        <div className="flex flex-wrap gap-2">
          <Toaster position="bottom-right" />
          <Button variant="outline" onClick={() => toast('Session started', { description: 'The agent is reading the repository.' })}>
            Default
          </Button>
          <Button variant="outline" onClick={() => toast.success('Merged', { description: 'Pull request #482 is on main.' })}>
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error('Run failed', { description: 'pnpm test timed out after 10 minutes.', action: { label: 'Retry', onClick: () => {} } })}
          >
            Error with action
          </Button>
        </div>
      ),
    },
  ],
});
