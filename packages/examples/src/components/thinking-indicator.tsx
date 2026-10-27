import { ThinkingIndicator } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'thinking-indicator',
  name: 'Thinking Indicator',
  category: 'ai',
  description: 'A short label with pulsing dots that shows while the agent works. Screen readers announce it without interrupting, and the dots stay still if reduced motion is on.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="grid gap-3">
          <ThinkingIndicator />
          <ThinkingIndicator label="Reading 14 files" />
        </div>
      ),
    },
  ],
});
