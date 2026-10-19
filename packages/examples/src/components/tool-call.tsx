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
          <ToolCall name="stripe.get_account" status="done" input={'{ "customer": "acme" }'} output={'{ "status": "active", "plan": "scale" }'} defaultOpen />
          <ToolCall name="intercom.search" status="running" />
          <ToolCall name="github.create_issue" status="error" output="403: token lacks repo scope" />
        </div>
      ),
    },
  ],
});
