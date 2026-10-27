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
          <StreamingText text="Acme’s outage started after Tuesday’s deploy. The fix ships Thursday; until then, the workaround in the help centre restores sync." />
        </p>
      ),
    },
  ],
});
