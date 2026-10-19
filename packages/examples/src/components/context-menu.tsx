import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'context-menu',
  name: 'Context Menu',
  category: 'overlays',
  description: 'A menu of actions that opens at the pointer when its area is right-clicked or long-pressed.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <ContextMenu>
          <ContextMenuTrigger className="flex h-36 w-full max-w-sm items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Right-click this file
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuLabel>theme.css</ContextMenuLabel>
            <ContextMenuGroup>
              <ContextMenuItem>
                Open <ContextMenuShortcut>⏎</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Rename <ContextMenuShortcut>F2</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSub>
                <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem>Copy link</ContextMenuItem>
                  <ContextMenuItem>Email to team</ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>Show in sidebar</ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuLabel>Sort by</ContextMenuLabel>
            <ContextMenuRadioGroup value="modified">
              <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
              <ContextMenuRadioItem value="modified">Last modified</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Move to trash</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ),
    },
  ],
});
