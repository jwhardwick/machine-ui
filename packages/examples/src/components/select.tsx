import { Label, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'select',
  name: 'Select',
  category: 'forms',
  description: 'A dropdown for picking one value from a short list, with groups and separators.',
  examples: [
    {
      name: 'Grouped',
      render: () => (
        <div className="grid gap-2">
          <Label htmlFor="select-model">Model</Label>
          <Select defaultValue="balanced">
            <SelectTrigger id="select-model" className="w-56">
              <SelectValue placeholder="Choose a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fast</SelectLabel>
                <SelectItem value="mini">Mini</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Thorough</SelectLabel>
                <SelectItem value="deep">Deep research</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ],
});
