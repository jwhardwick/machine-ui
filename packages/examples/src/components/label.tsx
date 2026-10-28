import { Input, Label } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'label',
  name: 'Label',
  category: 'forms',
  description: 'A text label for a form control. Clicking it focuses the control it names.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <div className="grid w-full max-w-xs gap-2">
          <Label htmlFor="label-email">Email address</Label>
          <Input id="label-email" type="email" placeholder="jared@example.com" />
        </div>
      ),
    },
  ],
});
