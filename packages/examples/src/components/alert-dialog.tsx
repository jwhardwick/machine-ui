import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'alert-dialog',
  name: 'Alert Dialog',
  category: 'overlays',
  description: 'A modal that asks you to confirm an important action. It closes only from its buttons or the Escape key.',
  examples: [
    {
      name: 'Destructive',
      render: () => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete workspace</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Northwind?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes 14 projects, their themes and history for every member. It can’t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep workspace</AlertDialogCancel>
              <AlertDialogAction variant="destructive">Delete workspace</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ],
});
