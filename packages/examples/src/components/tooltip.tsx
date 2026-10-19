import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@machine-ui/ui';
import { Bell } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'tooltip',
  name: 'Tooltip',
  category: 'overlays',
  description: 'A short label shown on hover or focus. Never put essential information only in a tooltip.',
  examples: [
    {
      name: 'Icon button',
      render: () => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Notifications">
              <Bell aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent>3 unread notifications</TooltipContent>
        </Tooltip>
      ),
    },
  ],
});
