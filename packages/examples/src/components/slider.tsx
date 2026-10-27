import { Label, Slider } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'slider',
  name: 'Slider',
  category: 'forms',
  description: 'Picks a number or a range by dragging. The arrow keys move it one step at a time.',
  examples: [
    {
      name: 'Single',
      render: () => (
        <div className="grid w-full max-w-xs gap-3">
          <Label id="slider-volume">Volume</Label>
          <Slider aria-labelledby="slider-volume" defaultValue={[60]} max={100} step={1} />
        </div>
      ),
    },
    {
      name: 'Range',
      render: () => (
        <div className="grid w-full max-w-xs gap-3">
          <Label id="slider-price">Price range</Label>
          <Slider aria-labelledby="slider-price" defaultValue={[20, 75]} max={100} step={5} />
        </div>
      ),
    },
  ],
});
