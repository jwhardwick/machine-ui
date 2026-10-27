import { Button, Input, Label, Popover, PopoverContent, PopoverTrigger } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'popover',
  name: 'Popover',
  category: 'overlays',
  description: 'A floating panel anchored to a trigger, for short forms, settings, and details.',
  examples: [
    {
      name: 'Settings',
      render: () => (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Dimensions</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-3">
              <p className="text-sm font-medium">Export size</p>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="pop-w">Width</Label>
                <Input id="pop-w" defaultValue="1440" className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="pop-h">Height</Label>
                <Input id="pop-h" defaultValue="900" className="col-span-2" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ],
});
