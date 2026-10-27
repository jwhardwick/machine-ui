import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@machine-ui/ui';
import { CreditCard, GitBranch, Settings, SquareTerminal, User } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'command',
  name: 'Command',
  category: 'overlays',
  description: 'A searchable list of actions with groups and shortcuts. Use CommandDialog to open it as a palette.',
  examples: [
    {
      name: 'Inline',
      render: () => (
        <Command className="w-full max-w-sm rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <SquareTerminal aria-hidden /> New session
              </CommandItem>
              <CommandItem>
                <GitBranch aria-hidden /> Switch branch
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User aria-hidden /> Profile <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard aria-hidden /> Billing <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings aria-hidden /> Preferences <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      ),
    },
  ],
});
