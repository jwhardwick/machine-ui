import { ToolCall } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'tool-call',
  name: 'Tool Call',
  category: 'ai',
  description: 'A tool the agent called, with its status and, on demand, its input and output.',
  examples: [
    {
      name: 'States',
      wide: true,
      render: () => (
        <div className="grid w-full max-w-md gap-2">
          <ToolCall name="bash" status="done" input="pnpm test e2e/upload.spec.ts" output={'12 passed, 1 failed\nupload › rejects files over 2 GB'} defaultOpen />
          <ToolCall name="read_file" status="running" input="src/upload/chunked-upload.ts" />
          <ToolCall name="github.create_pull_request" status="error" output="403: token lacks write access to hooli/nucleus" />
        </div>
      ),
    },
  ],
});
