import { ConfidenceBar } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'confidence-bar',
  name: 'Confidence Bar',
  category: 'ai',
  description: 'Shows how sure the agent is with a bar and a word (high, medium, or low), so colour isn’t the only cue.',
  examples: [
    {
      name: 'Levels',
      render: () => (
        <div className="grid w-full max-w-xs gap-4">
          <ConfidenceBar value={92} label="Root cause" />
          <ConfidenceBar value={64} label="Fix covers every caller" />
          <ConfidenceBar value={31} label="Safe to auto-merge" />
        </div>
      ),
    },
  ],
});
