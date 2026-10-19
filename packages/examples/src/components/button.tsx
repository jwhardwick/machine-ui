import { Button } from '@machine-ui/ui';
import { ArrowRight, Loader2, Plus } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'button',
  name: 'Button',
  category: 'forms',
  description: 'Triggers an action. Six variants and four sizes, with icon, loading and disabled states.',
  examples: [
    { name: 'Default', render: () => <Button>Send reply</Button> },
    {
      name: 'Variants',
      render: () => (
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="link">Read the docs</Button>
        </div>
      ),
    },
    {
      name: 'Sizes',
      render: () => (
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <Plus aria-hidden />
          </Button>
        </div>
      ),
    },
    {
      name: 'With icon',
      render: () => (
        <Button>
          Continue <ArrowRight aria-hidden />
        </Button>
      ),
    },
    {
      name: 'Loading',
      render: () => (
        <Button disabled>
          <Loader2 aria-hidden className="animate-spin" /> Saving
        </Button>
      ),
    },
  ],
});
