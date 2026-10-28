import { StatusDot } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'status-dot',
  name: 'Status Dot',
  category: 'feedback',
  description: 'A small coloured dot for presence and health, always paired with a text label.',
  examples: [
    {
      name: 'Tones',
      render: () => (
        <ul className="grid gap-2 text-sm">
          <li className="flex items-center gap-2">
            <StatusDot tone="online" pulse /> Agent runners operational
          </li>
          <li className="flex items-center gap-2">
            <StatusDot tone="busy" /> GitHub webhooks delayed
          </li>
          <li className="flex items-center gap-2">
            <StatusDot tone="error" /> Preview deploys degraded
          </li>
          <li className="flex items-center gap-2">
            <StatusDot tone="offline" /> Legacy runner retired
          </li>
        </ul>
      ),
    },
  ],
});
