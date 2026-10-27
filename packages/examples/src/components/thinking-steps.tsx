import { ThinkingSteps } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'thinking-steps',
  name: 'Thinking Steps',
  category: 'ai',
  description: 'The steps an agent is working through, with done, active, and upcoming states.',
  examples: [
    {
      name: 'In progress',
      render: () => (
        <ThinkingSteps
          className="max-w-sm"
          steps={[
            { label: 'Read the Intercom thread', detail: 'ticket #8812', state: 'done' },
            { label: 'Check the changelog', detail: 'last 2 releases', state: 'done' },
            { label: 'Pull Stripe account status', state: 'active' },
            { label: 'Draft a reply', state: 'upcoming' },
          ]}
        />
      ),
    },
  ],
});
