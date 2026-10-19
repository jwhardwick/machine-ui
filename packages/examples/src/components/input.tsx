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
          <Input id="input-name" defaultValue="Northwind" />
        </div>
      ),
    },
    {
      name: 'Invalid',
      render: () => (
        <div className="grid w-full max-w-xs gap-2">
          <Label htmlFor="input-domain">Domain</Label>
          <Input id="input-domain" aria-invalid defaultValue="northwind" aria-describedby="input-domain-error" />
          <p id="input-domain-error" className="text-sm text-destructive">
            Enter a full domain, like northwind.com.
          </p>
        </div>
      ),
    },
    {
      name: 'Disabled',
      render: () => <Input aria-label="Team ID" disabled defaultValue="team_8f2k" className="max-w-xs" />,
    },
  ],
});
