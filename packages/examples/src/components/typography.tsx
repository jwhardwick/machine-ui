import { Blockquote, H1, H2, H3, H4, InlineCode, Lead, List, Muted, P } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'typography',
  name: 'Typography',
  category: 'data',
  description: 'Text styles on the theme’s fluid type scale: headings use the display face, body uses the text face.',
  examples: [
    {
      name: 'Article',
      wide: true,
      render: () => (
        <article className="max-w-prose">
          <H1>Make it look like yours</H1>
          <Lead className="mt-3">A theme is a handful of decisions, expanded into hundreds of consistent ones.</Lead>
          <H2 className="mt-8">Why seeds</H2>
          <P>
            Picking 19 colours by hand invites mistakes. Picking a hue, a temperature and a few personality settings does not. Run{' '}
            <InlineCode>applyTheme(seed)</InlineCode> and the rest follows.
          </P>
          <H3 className="mt-6">Light and dark together</H3>
          <P>Both modes come from one seed, so they always feel like the same product.</P>
          <H4 className="mt-6">Fluid sizes</H4>
          <P>Headings scale with the viewport; body text never drops below 1rem.</P>
          <Blockquote>Every text pair is solved for contrast before you ever see it.</Blockquote>
          <List>
            <li>Light and dark from the same seed</li>
            <li>Fluid type that never shrinks body text below 1rem</li>
            <li>Motion that turns off for people who ask for less</li>
          </List>
          <Muted>Updated 19 October 2026</Muted>
        </article>
      ),
    },
  ],
});
