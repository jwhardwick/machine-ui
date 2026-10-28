import { CopyInput, Label } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'copy-input',
  name: 'Copy Input',
  category: 'forms',
  description: 'A read-only field with a copy button, for API keys, webhook URLs, and share links.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="grid w-full max-w-sm gap-2">
          <Label htmlFor="copy-webhook">Webhook URL</Label>
          <CopyInput id="copy-webhook" value="https://hooks.machine-co.dev/agent/8f2k1x" />
        </div>
      ),
    },
  ],
});
