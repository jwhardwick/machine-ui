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
            { label: 'Read the failing test', detail: 'e2e/upload.spec.ts', state: 'done' },
            { label: 'Bisect recent merges', detail: 'PRs #470 to #477', state: 'done' },
            { label: 'Patch the chunking flag', state: 'active' },
            { label: 'Run the suite again', state: 'upcoming' },
          ]}
        />
      ),
    },
  ],
});
