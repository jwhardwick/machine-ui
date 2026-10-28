import { Avatar, AvatarFallback, Button, HoverCard, HoverCardContent, HoverCardTrigger } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'hover-card',
  name: 'Hover Card',
  category: 'overlays',
  description: 'A floating preview that shows while the pointer is over its trigger, or while the trigger has focus.',
  examples: [
    {
      name: 'Profile preview',
      render: () => (
        <HoverCard openDelay={150}>
          <HoverCardTrigger asChild>
            <Button variant="link">@gilfoyle</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>BG</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 text-sm">
                <p className="font-medium">Bertram Gilfoyle</p>
                <p className="text-muted-foreground">Engineer at machine-co. Reviews most of the agent’s pull requests.</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ),
    },
  ],
});
