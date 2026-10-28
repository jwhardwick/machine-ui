import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'dialog',
  name: 'Dialog',
  category: 'overlays',
  description: 'A modal window over the page. Focus moves inside, Escape closes it and focus returns to the trigger.',
  examples: [
    {
      name: 'Form',
      render: () => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Rename session</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename session</DialogTitle>
              <DialogDescription>The new name shows in the sidebar and becomes the pull request title.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="dialog-name">Name</Label>
              <Input id="dialog-name" defaultValue="Middle-out compression spike" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button>Save name</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ],
});
