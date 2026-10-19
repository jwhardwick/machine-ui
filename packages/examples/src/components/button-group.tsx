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
        <ButtonGroup aria-label="Message actions">
          <Button variant="outline">Reply</Button>
          <Button variant="outline">Assign</Button>
          <Button variant="outline">Snooze</Button>
        </ButtonGroup>
      ),
    },
    {
      name: 'Split button',
      render: () => (
        <ButtonGroup aria-label="Deploy">
          <Button>Deploy</Button>
          <Button size="icon" aria-label="More deploy options" className="border-l border-primary-foreground/20">
            <ChevronDown aria-hidden />
          </Button>
        </ButtonGroup>
      ),
    },
  ],
});
