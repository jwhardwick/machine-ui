import { Label, Switch } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'switch',
  name: 'Switch',
  category: 'forms',
  description: 'Turns a setting on or off immediately, without a save step.',
  examples: [
    {
      name: 'States',
      render: () => (
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Switch id="sw-1" defaultChecked />
            <Label htmlFor="sw-1">Fix lint errors automatically</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="sw-2" />
            <Label htmlFor="sw-2">Pick up new issues labelled agent</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="sw-3" disabled />
            <Label htmlFor="sw-3">Auto-merge when checks pass (owners only)</Label>
          </div>
        </div>
      ),
    },
  ],
});
