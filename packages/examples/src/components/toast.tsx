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
          <Button variant="outline" onClick={() => toast('Theme saved', { description: 'Share the link to preview it.' })}>
            Default
          </Button>
          <Button variant="outline" onClick={() => toast.success('Published', { description: 'Version 2.4.0 is live.' })}>
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error('Deploy failed', { description: 'Step 3 timed out.', action: { label: 'Retry', onClick: () => {} } })}
          >
            Error with action
          </Button>
        </div>
      ),
    },
  ],
});
