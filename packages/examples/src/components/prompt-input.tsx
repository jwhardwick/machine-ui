import { Button, PromptInput, PromptSuggestions } from '@machine-ui/ui';
import { Paperclip } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'prompt-input',
  name: 'Prompt Input',
  category: 'ai',
  description: 'The message box for a chat, with a text field that grows as you type, tools, and a send button. Enter sends and Shift+Enter adds a line. While the agent works, send becomes stop.',
  examples: [
    {
      name: 'With suggestions',
      wide: true,
      render: () => (
        <div className="grid w-full max-w-xl gap-3">
          <PromptSuggestions suggestions={['Why is CI red on main?', 'Write tests for the upload handler', 'Review my open pull request']} />
          <PromptInput
            placeholder="Ask Alpha to change something…"
            hint="Alpha can make mistakes. Review the diff before you merge."
            tools={
              <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                <Paperclip aria-hidden /> Attach
              </Button>
            }
          />
        </div>
      ),
    },
    {
      name: 'Busy',
      wide: true,
      render: () => <PromptInput className="w-full max-w-xl" busy placeholder="Alpha is working…" />,
    },
  ],
});
