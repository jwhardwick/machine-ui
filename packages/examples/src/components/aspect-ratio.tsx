import { AspectRatio } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'aspect-ratio',
  name: 'Aspect Ratio',
  category: 'layout',
  description: 'Keeps media at a fixed shape as its width changes.',
  examples: [
    {
      name: '16 by 9',
      render: () => (
        <div className="w-full max-w-sm">
          <AspectRatio ratio={16 / 9} className="flex items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
            16 : 9
          </AspectRatio>
        </div>
      ),
    },
  ],
});
