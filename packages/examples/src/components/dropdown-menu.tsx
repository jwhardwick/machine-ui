import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@machine-ui/ui';
import { LogOut, Settings, User } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'dropdown-menu',
  name: 'Dropdown Menu',
  category: 'overlays',
  description: 'A menu of actions below a trigger, with icons, shortcuts, checkbox items, submenus and a destructive style.',
  examples: [
    {
      name: 'Account menu',
      render: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Ada Lovelace</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>ada@northwind.dev</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User aria-hidden /> Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings aria-hidden /> Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Switch workspace</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Northwind</DropdownMenuItem>
                <DropdownMenuItem>Lumen Labs</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuCheckboxItem checked>Compact mode</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Panel position</DropdownMenuLabel>
            <DropdownMenuRadioGroup value="right">
              <DropdownMenuRadioItem value="left">Left</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut aria-hidden /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ],
});
