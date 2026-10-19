import { Button, Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'drawer',
  name: 'Drawer',
  category: 'overlays',
  description: 'A bottom sheet with a drag handle, for mobile-first flows. Swipe down or press Escape to close.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Set a goal</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Daily goal</DrawerTitle>
                <DrawerDescription>How many minutes a day do you want to practise?</DrawerDescription>
              </DrawerHeader>
              <p className="py-6 text-center font-display text-6xl font-semibold tabular-nums">25</p>
              <DrawerFooter>
                <Button>Save goal</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      ),
    },
  ],
});
