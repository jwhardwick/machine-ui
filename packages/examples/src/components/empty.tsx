import { Button, Empty, EmptyActions, EmptyDescription, EmptyMedia, EmptyTitle } from '@machine-ui/ui';
import { FolderOpen } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'empty',
  name: 'Empty',
  category: 'feedback',
  description: 'A placeholder for an empty view. It explains what goes there and offers one action to get started.',
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
