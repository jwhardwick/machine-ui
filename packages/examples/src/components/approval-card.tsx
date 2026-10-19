import { ApprovalCard } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'approval-card',
  name: 'Approval Card',
  category: 'ai',
  description: 'The agent asks before it acts: a question, a few options and Confirm or Skip.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <ApprovalCard
          className="max-w-md"
          question="How should I reply to Acme?"
          options={[
            { value: 'workaround', label: 'Send the workaround', description: 'Restores sync now; fix lands Thursday.' },
            { value: 'wait', label: 'Wait for the fix', description: 'Reply Thursday with the release note.' },
            { value: 'escalate', label: 'Escalate to engineering' },
          ]}
        />
      ),
    },
  ],
});
