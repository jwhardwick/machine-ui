import { StreamingText } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'streaming-text',
  name: 'Streaming Text',
  category: 'ai',
  description: 'Types out a response with a cursor, then hides the cursor. If reduced motion is on, it shows the whole text at once.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <p className="max-w-md text-sm leading-relaxed">
          <StreamingText text="Found it. The upload test sends 3 GB in one request, but #477 capped single requests at 2 GB. I’ll switch the test to chunked uploads." />
        </p>
      ),
    },
  ],
});
