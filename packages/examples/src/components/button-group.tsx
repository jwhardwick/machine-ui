import { Button, ButtonGroup } from '@machine-ui/ui';
import { ChevronDown } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'button-group',
  name: 'Button Group',
  category: 'forms',
  description: 'Joins related buttons into one row with shared edges, including split buttons.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <ButtonGroup aria-label="Review actions">
          <Button variant="outline">Approve</Button>
          <Button variant="outline">Comment</Button>
          <Button variant="outline">Request changes</Button>
        </ButtonGroup>
      ),
    },
    {
      name: 'Split button',
      render: () => (
        <ButtonGroup aria-label="Merge">
          <Button>Squash and merge</Button>
          <Button size="icon" aria-label="More merge options" className="border-l border-primary-foreground/20">
            <ChevronDown aria-hidden />
          </Button>
        </ButtonGroup>
      ),
    },
  ],
});
