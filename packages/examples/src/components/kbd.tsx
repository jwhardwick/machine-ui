import { Kbd, KbdGroup } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'kbd',
  name: 'Kbd',
  category: 'data',
  description: 'Shows a keyboard key or shortcut in a small keycap.',
  examples: [
    {
      name: 'Shortcuts',
      render: () => (
        <div className="grid gap-3 text-sm">
          <p className="flex items-center gap-2">
            Open the command menu
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </p>
          <p className="flex items-center gap-2">
            Toggle the sidebar
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>B</Kbd>
            </KbdGroup>
          </p>
        </div>
      ),
    },
  ],
});
