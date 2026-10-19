import { ConfidenceBar } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'confidence-bar',
  name: 'Confidence Bar',
  category: 'ai',
  description: 'How sure the agent is, as a bar plus a word (high, medium, low), so colour is never the only signal.',
  examples: [
    {
      name: 'Levels',
      render: () => (
        <div className="grid w-full max-w-xs gap-4">
          <ConfidenceBar value={92} label="Root cause" />
          <ConfidenceBar value={64} label="Ships Thursday" />
          <ConfidenceBar value={31} label="Affects other accounts" />
        </div>
      ),
    },
  ],
});
