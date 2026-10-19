import { Label, Progress } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'progress',
  name: 'Progress',
  category: 'feedback',
  description: 'Shows how far a task with a known length has come.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="grid w-full max-w-sm gap-2">
          <div className="flex justify-between text-sm">
            <Label id="progress-upload">Uploading brand assets</Label>
            <span className="tabular-nums text-muted-foreground">64%</span>
          </div>
          <Progress aria-labelledby="progress-upload" value={64} />
        </div>
      ),
    },
  ],
});
