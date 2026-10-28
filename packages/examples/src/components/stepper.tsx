import { Stepper } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'stepper',
  name: 'Stepper',
  category: 'navigation',
  description: 'Progress through a fixed sequence of steps, with done, current, and upcoming states.',
  examples: [
    {
      name: 'Onboarding',
      wide: true,
      render: () => (
        <Stepper
          className="max-w-2xl"
          current={2}
          steps={[
            { title: 'Connect GitHub', description: 'Pick your repositories' },
            { title: 'Team', description: 'Invite your reviewers' },
            { title: 'Permissions', description: 'Choose what the agent can do' },
            { title: 'First session', description: 'Fix a starter issue' },
          ]}
        />
      ),
    },
  ],
});
