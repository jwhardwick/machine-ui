import { SearchInput } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'search-input',
  name: 'Search Input',
  category: 'forms',
  description: 'A search field with a shortcut hint, and a clear button once there is a value.',
  examples: [
    {
      name: 'Default',
      render: () => <SearchInput aria-label="Search threads" placeholder="Search threads" shortcut="⌘K" className="max-w-xs" />,
    },
    {
      name: 'With value',
      render: () => <SearchInput aria-label="Search threads" defaultValue="refund" className="max-w-xs" />,
    },
  ],
});
