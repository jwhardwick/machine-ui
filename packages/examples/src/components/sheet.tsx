import {
  Button,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'sheet',
  name: 'Sheet',
  category: 'overlays',
  description: 'A panel that slides in from any edge over a scrim. Good for edit forms and detail views.',
  examples: [
    {
      name: 'Edit panel',
      render: () => (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Edit member</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit member</SheetTitle>
              <SheetDescription>Changes apply the next time they sign in.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 px-4">
              <div className="grid gap-2">
                <Label htmlFor="sheet-name">Name</Label>
                <Input id="sheet-name" defaultValue="Grace Hopper" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sheet-role">Role</Label>
                <Input id="sheet-role" defaultValue="Admin" />
              </div>
            </div>
            <SheetFooter>
              <Button>Save member</Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ),
    },
  ],
});
