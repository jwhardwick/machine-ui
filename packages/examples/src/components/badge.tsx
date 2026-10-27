import { Badge } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'badge',
  name: 'Badge',
  category: 'data',
  description: 'A small label for state or category, in primary, secondary, outline, and destructive styles.',
  examples: [
    {
      name: 'Variants',
      render: () => (
        <div className="flex flex-wrap gap-2">
          <Badge>Merged</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="outline">v2.4.0</Badge>
          <Badge variant="destructive">3 checks failing</Badge>
        </div>
      ),
    },
  ],
});
