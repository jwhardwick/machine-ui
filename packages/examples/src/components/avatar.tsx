import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@machine-ui/ui';

/** An abstract portrait as an inline SVG, so the example needs no network. */
const PORTRAIT =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' opacity='0.12'/><circle cx='20' cy='16' r='7' opacity='0.45'/><rect x='8' y='26' width='24' height='14' rx='7' opacity='0.45'/></svg>";
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'avatar',
  name: 'Avatar',
  category: 'data',
  description: 'Shows a person as a photo or initials, alone or as an overlapping group.',
  examples: [
    {
      name: 'Photo and fallback',
      render: () => (
        <div className="flex items-center gap-4">
          <Avatar className="size-10">
            <AvatarImage src={PORTRAIT} alt="Ada Lovelace" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar className="size-10">
            <AvatarImage src="/missing-photo.png" alt="Grace Hopper" />
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
        </div>
      ),
    },
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
