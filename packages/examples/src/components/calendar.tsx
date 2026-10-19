import { Calendar } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

const MONTH = new Date(2026, 9, 1);

export default defineDoc({
  slug: 'calendar',
  name: 'Calendar',
  category: 'forms',
  description: 'A month grid for picking a single date or a range, with today marked and keyboard navigation.',
  examples: [
    {
      name: 'Single date',
      render: () => <Calendar mode="single" defaultMonth={MONTH} selected={new Date(2026, 9, 19)} className="rounded-md border" />,
    },
    {
      name: 'Range',
      render: () => (
        <Calendar
          mode="range"
          defaultMonth={MONTH}
          selected={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 16) }}
          className="rounded-md border"
        />
      ),
    },
  ],
});
