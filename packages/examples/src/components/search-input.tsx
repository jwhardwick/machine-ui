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
      render: () => <SearchInput aria-label="Search sessions" placeholder="Search sessions" shortcut="⌘K" className="max-w-xs" />,
    },
    {
      name: 'With value',
      render: () => <SearchInput aria-label="Search sessions" defaultValue="flaky test" className="max-w-xs" />,
    },
  ],
});
