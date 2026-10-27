import { ApprovalCard } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'approval-card',
  name: 'Approval Card',
  category: 'ai',
  description: 'Lets the agent check with you before it acts, with a question, a few options, and Confirm and Skip buttons.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <ApprovalCard
          className="max-w-md"
          question="The migration fails on Hooli’s data. What should I do?"
          options={[
            { value: 'default', label: 'Add a default value', description: 'Existing rows pass, and the column stays required.' },
            { value: 'rollback', label: 'Roll back the migration', description: 'Safe now. The column comes back next release.' },
            { value: 'ask', label: 'Ask the team in #eng' },
          ]}
        />
      ),
    },
  ],
});
