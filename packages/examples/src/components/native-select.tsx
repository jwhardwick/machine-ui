import { Label, NativeSelect } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'native-select',
  name: 'Native Select',
  category: 'forms',
  description: 'The browser’s own select, styled to match the theme. Best on mobile and for long option lists.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="grid w-full max-w-xs gap-2">
          <Label htmlFor="ns-region">Region</Label>
          <NativeSelect id="ns-region" defaultValue="eu-west">
            <option value="us-east">US East (Virginia)</option>
            <option value="eu-west">EU West (Dublin)</option>
            <option value="ap-south">Asia Pacific (Sydney)</option>
          </NativeSelect>
        </div>
      ),
    },
  ],
});
