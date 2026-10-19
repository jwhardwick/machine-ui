import { AgentGlyph, Button, Message, MessageActions, MessageContent } from '@machine-ui/ui';
import { Copy, RotateCcw, ThumbsDown, ThumbsUp } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'message',
  name: 'Message',
  category: 'ai',
  description: 'One turn in a conversation. User turns sit right in a bubble; assistant turns read as plain text with actions.',
  examples: [
    {
      name: 'Exchange',
      wide: true,
      render: () => (
        <div className="grid w-full max-w-xl gap-6">
          <Message from="user">
            <MessageContent>What happened with Acme’s outage, and what should I tell them?</MessageContent>
          </Message>
          <Message from="assistant">
            <AgentGlyph className="size-7" />
            <MessageContent>
              <p>
                The outage began after Tuesday’s deploy changed the sync interval. A fix ships Thursday. Until then, the workaround in
                the help centre restores sync within a minute.
              </p>
              <p>I’d send them the workaround now and promise an update Thursday.</p>
              <MessageActions>
                <Button variant="ghost" size="icon" className="size-7" aria-label="Copy response">
                  <Copy aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" className="size-7" aria-label="Regenerate">
                  <RotateCcw aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" className="size-7" aria-label="Good response">
                  <ThumbsUp aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" className="size-7" aria-label="Bad response">
                  <ThumbsDown aria-hidden />
                </Button>
              </MessageActions>
            </MessageContent>
          </Message>
        </div>
      ),
    },
  ],
});
