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
            <Label htmlFor="sw-1">Weekly digest</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="sw-2" />
            <Label htmlFor="sw-2">Product updates</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="sw-3" disabled />
            <Label htmlFor="sw-3">Billing alerts (owner only)</Label>
          </div>
        </div>
      ),
    },
  ],
});
