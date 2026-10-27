import { Button, Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle, Switch } from '@machine-ui/ui';
import { Bell, Shield } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'item',
  name: 'Item',
  category: 'data',
  description: 'A row with media, a title, a description and actions, for lists, settings, and search results.',
  examples: [
    {
      name: 'Settings list',
      render: () => (
        <ItemGroup className="w-full max-w-md gap-2">
          <Item variant="outline">
            <ItemMedia>
              <Shield aria-hidden />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Two-step verification</ItemTitle>
              <ItemDescription>Required for admins since 1 October.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="outline">
                Manage
              </Button>
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia>
              <Bell aria-hidden />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Failed run alerts</ItemTitle>
              <ItemDescription>Email me when an agent run fails.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch aria-label="Failed run alerts" defaultChecked />
            </ItemActions>
          </Item>
        </ItemGroup>
      ),
    },
  ],
});
