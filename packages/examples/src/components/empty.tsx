import { Button, Empty, EmptyActions, EmptyDescription, EmptyMedia, EmptyTitle } from '@machine-ui/ui';
import { SquareTerminal } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'empty',
  name: 'Empty',
  category: 'feedback',
  description: 'A placeholder for an empty view. It explains what goes there and offers one action to get started.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <Empty className="max-w-md">
          <EmptyMedia>
            <SquareTerminal aria-hidden />
          </EmptyMedia>
          <EmptyTitle>No sessions yet</EmptyTitle>
          <EmptyDescription>Start a session and the agent can fix a bug, write tests, or review a pull request.</EmptyDescription>
          <EmptyActions>
            <Button>New session</Button>
            <Button variant="ghost">Browse open issues</Button>
          </EmptyActions>
        </Empty>
      ),
    },
  ],
});
