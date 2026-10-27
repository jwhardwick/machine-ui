import { Label, Textarea } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'textarea',
  name: 'Textarea',
  category: 'forms',
  description: 'A multi-line text field that resizes vertically. Use it for messages, notes and descriptions.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="ta-task">Task for Alpha</Label>
          <Textarea id="ta-task" placeholder="Run the Weissman score benchmark on every pull request…" />
        </div>
      ),
    },
    {
      name: 'Invalid',
      render: () => <Textarea aria-label="Release notes" aria-invalid defaultValue="" placeholder="Release notes are required" className="max-w-sm" />,
    },
  ],
});
