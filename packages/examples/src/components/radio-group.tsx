import { Label, RadioGroup, RadioGroupItem } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'radio-group',
  name: 'Radio Group',
  category: 'forms',
  description: 'A set of options where exactly one is selected. Arrow keys move the selection.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <RadioGroup defaultValue="weekly" aria-label="Digest frequency">
          {[
            ['daily', 'Every morning'],
            ['weekly', 'Mondays only'],
            ['never', 'Never'],
          ].map(([value, label]) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value!} id={`rg-${value}`} />
              <Label htmlFor={`rg-${value}`}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      ),
    },
  ],
});
