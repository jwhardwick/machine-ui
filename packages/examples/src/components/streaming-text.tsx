import { StreamingText } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'streaming-text',
  name: 'Streaming Text',
  category: 'ai',
  description: 'Types a response out with a cursor, then hides the cursor. Shows the whole text at once under reduced motion.',
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
