import { Avatar, AvatarFallback, AvatarGroup } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'avatar',
  name: 'Avatar',
  category: 'data',
  description: 'Shows a person as a photo or initials, alone or as an overlapping group.',
  examples: [
    {
      name: 'Group',
      render: () => (
        <div className="flex items-center gap-6">
          <Avatar className="size-10">
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <AvatarGroup>
            {['GH', 'KJ', 'MH', 'RB'].map((initials) => (
              <Avatar key={initials}>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      ),
    },
  ],
});
