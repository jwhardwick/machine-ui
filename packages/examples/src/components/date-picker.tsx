import { DatePicker, Label } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'date-picker',
  name: 'Date Picker',
  category: 'forms',
  description: 'A button that opens a Calendar and shows the chosen date in short form.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="grid gap-2">
          <Label htmlFor="dp-launch">Launch date</Label>
          <DatePicker id="dp-launch" defaultValue={new Date(2026, 10, 3)} />
        </div>
      ),
    },
  ],
});
