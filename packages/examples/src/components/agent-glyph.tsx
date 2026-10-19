import { AgentGlyph } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'agent-glyph',
  name: 'Agent Glyph',
  category: 'ai',
  description: 'The agent’s mark, used as its avatar beside messages and activity. Takes the theme’s primary colour.',
  examples: [
    {
      name: 'Sizes',
      render: () => (
        <div className="flex items-center gap-3">
          <AgentGlyph className="size-6" />
          <AgentGlyph />
          <AgentGlyph className="size-12" label="Alpha, your assistant" />
        </div>
      ),
    },
  ],
});
