import { Stepper } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'stepper',
  name: 'Stepper',
  category: 'navigation',
  description: 'Progress through a fixed sequence of steps, with done, current and upcoming states.',
  examples: [
    {
      name: 'Onboarding',
      wide: true,
      render: () => (
        <Stepper
          className="max-w-2xl"
          current={2}
          steps={[
            { title: 'Account', description: 'Name and email' },
            { title: 'Workspace', description: 'Invite your team' },
            { title: 'Theme', description: 'Pick a starting point' },
            { title: 'Install', description: 'Add to your app' },
          ]}
        />
      ),
    },
  ],
});
