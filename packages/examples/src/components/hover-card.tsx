import { Avatar, AvatarFallback, Button, HoverCard, HoverCardContent, HoverCardTrigger } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'hover-card',
  name: 'Hover Card',
  category: 'overlays',
  description: 'A floating preview shown while the pointer rests on, or focus is on, its trigger.',
  examples: [
    {
      name: 'Profile preview',
      render: () => (
        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <Button variant="link">@ada</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 text-sm">
                <p className="font-medium">Ada Lovelace</p>
                <p className="text-muted-foreground">Design systems at Northwind. Maintains the theme engine.</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ),
    },
  ],
});
