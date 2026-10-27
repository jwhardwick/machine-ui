import { Toggle } from '@machine-ui/ui';
import { Bold, Italic, Star } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'toggle',
  name: 'Toggle',
  category: 'forms',
  description: 'A button that stays pressed, for one on/off option such as a filter or formatting.',
  examples: [
    {
      name: 'Variants',
      render: () => (
        <div className="flex items-center gap-2">
          <Toggle aria-label="Bold">
            <Bold aria-hidden />
          </Toggle>
          <Toggle aria-label="Italic" defaultPressed>
            <Italic aria-hidden />
          </Toggle>
          <Toggle variant="outline">
            <Star aria-hidden /> My pull requests
          </Toggle>
        </div>
      ),
    },
  ],
});
