import { Checkbox, Label } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'checkbox',
  name: 'Checkbox',
  category: 'forms',
  description: 'Turns an option on or off. It also has an indeterminate state for when only some items are selected.',
  examples: [
    {
      name: 'States',
      render: () => (
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="cb-1" />
            <Label htmlFor="cb-1">Run tests before every commit</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-2" defaultChecked />
            <Label htmlFor="cb-2">Let the agent install dependencies</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-3" checked="indeterminate" />
            <Label htmlFor="cb-3">Some repositories selected</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb-4" disabled />
            <Label htmlFor="cb-4">Push to protected branches (admins only)</Label>
          </div>
        </div>
      ),
    },
  ],
});
