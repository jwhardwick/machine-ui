import { ThinkingIndicator } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'thinking-indicator',
  name: 'Thinking Indicator',
  category: 'ai',
  description: 'A short label with pulsing dots while the agent works. Announced politely; still when motion is off.',
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
