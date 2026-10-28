import { Input, Label } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'input',
  name: 'Input',
  category: 'forms',
  description: 'A single-line text field, with invalid and disabled states.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="grid w-full max-w-xs gap-2">
          <Label htmlFor="input-name">Workspace name</Label>
          <Input id="input-name" defaultValue="machine-co" />
        </div>
      ),
    },
    {
      name: 'Invalid',
      render: () => (
        <div className="grid w-full max-w-xs gap-2">
          <Label htmlFor="input-branch">Branch name</Label>
          <Input id="input-branch" aria-invalid defaultValue="fix middle out" aria-describedby="input-branch-error" />
          <p id="input-branch-error" className="text-sm text-destructive">
            Branch names can’t contain spaces. Try fix/middle-out.
          </p>
        </div>
      ),
    },
    {
      name: 'Disabled',
      render: () => <Input aria-label="Session ID" disabled defaultValue="ses_8f2k" className="max-w-xs" />,
    },
  ],
});
