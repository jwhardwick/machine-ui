import { Combobox, Label } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

const TIMEZONES = [
  { value: 'utc', label: 'UTC' },
  { value: 'london', label: 'London (GMT+1)' },
  { value: 'new-york', label: 'New York (GMT−4)' },
  { value: 'sydney', label: 'Sydney (GMT+11)' },
  { value: 'tokyo', label: 'Tokyo (GMT+9)' },
];

export default defineDoc({
  slug: 'combobox',
  name: 'Combobox',
  category: 'forms',
  description: 'A select with a search field. Type to narrow the options, then pick one.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="grid gap-2">
          <Label htmlFor="cb-tz">Time zone</Label>
          <Combobox id="cb-tz" options={TIMEZONES} placeholder="Select a time zone" searchPlaceholder="Search time zones…" />
        </div>
      ),
    },
  ],
});
