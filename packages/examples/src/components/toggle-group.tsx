import { ToggleGroup, ToggleGroupItem } from '@machine-ui/ui';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'toggle-group',
  name: 'Toggle Group',
  category: 'forms',
  description: 'A joined row of toggles for picking one option, or several, from a small set.',
  examples: [
    {
      name: 'Single',
      render: () => (
        <ToggleGroup type="single" defaultValue="left" variant="outline" aria-label="Text alignment">
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align centre">
            <AlignCenter aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight aria-hidden />
          </ToggleGroupItem>
        </ToggleGroup>
      ),
    },
    {
      name: 'Multiple',
      render: () => (
        <ToggleGroup type="multiple" defaultValue={['open']} aria-label="Issue filters">
          <ToggleGroupItem value="open">Open</ToggleGroupItem>
          <ToggleGroupItem value="assigned">Assigned to me</ToggleGroupItem>
          <ToggleGroupItem value="blocked">Blocked</ToggleGroupItem>
        </ToggleGroup>
      ),
    },
  ],
});
