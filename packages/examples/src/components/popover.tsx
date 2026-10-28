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
            <Button variant="outline">Limits</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-3">
              <p className="text-sm font-medium">Session limits</p>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="pop-w">Minutes</Label>
                <Input id="pop-w" defaultValue="45" className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-2">
                <Label htmlFor="pop-h">Files</Label>
                <Input id="pop-h" defaultValue="30" className="col-span-2" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ],
});
