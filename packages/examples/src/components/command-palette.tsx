import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  Kbd,
} from '@machine-ui/ui';
import { FileText, Palette, Settings } from 'lucide-react';
import { useState } from 'react';
import { defineDoc } from '../types.ts';

function Palette_() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => setOpen(false)}>
              <Palette aria-hidden /> Change theme
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <FileText aria-hidden /> New document
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Settings aria-hidden /> Preferences <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default defineDoc({
  slug: 'command-palette',
  name: 'Command Palette',
  category: 'overlays',
  description: 'Command in a modal, opened from a button or a shortcut. Typing filters, arrows move, Enter runs, Escape closes.',
  examples: [{ name: 'Default', render: () => <Palette_ /> }],
});
