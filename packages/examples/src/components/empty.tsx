import { Button, Empty, EmptyActions, EmptyDescription, EmptyMedia, EmptyTitle } from '@machine-ui/ui';
import { FolderOpen } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'empty',
  name: 'Empty',
  category: 'feedback',
  description: 'A placeholder for a view with nothing in it yet: what it is for, and the one action to start.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <Empty className="max-w-md">
          <EmptyMedia>
            <FolderOpen aria-hidden />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Projects hold your themes and components. Create one to get started.</EmptyDescription>
          <EmptyActions>
            <Button>Create project</Button>
            <Button variant="ghost">Import from Figma</Button>
          </EmptyActions>
        </Empty>
      ),
    },
  ],
});
