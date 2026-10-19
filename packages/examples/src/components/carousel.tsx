import { Card, CardContent, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

const SLIDES = ['Graphite', 'Harbor', 'Folio', 'Console', 'Bloom'];

export default defineDoc({
  slug: 'carousel',
  name: 'Carousel',
  category: 'layout',
  description: 'A row of slides with previous and next buttons, swipe, and arrow-key support.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <Carousel className="w-full max-w-xs" aria-label="Themes">
          <CarouselContent>
            {SLIDES.map((name, i) => (
              <CarouselItem key={name} aria-label={`${i + 1} of ${SLIDES.length}`}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="font-display text-3xl font-semibold">{name}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ),
    },
  ],
});
