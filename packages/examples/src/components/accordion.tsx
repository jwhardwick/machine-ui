import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'accordion',
  name: 'Accordion',
  category: 'layout',
  description: 'A stack of headings that each reveal a section. One or several sections can be open.',
  examples: [
    {
      name: 'FAQ',
      render: () => (
        <Accordion type="single" collapsible defaultValue="contrast" className="w-full max-w-md">
          <AccordionItem value="contrast">
            <AccordionTrigger>How is contrast guaranteed?</AccordionTrigger>
            <AccordionContent>
              The engine adjusts lightness until every text pair reaches 4.5:1 and every control boundary 3:1, in light and dark.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="fonts">
            <AccordionTrigger>Can I use my own fonts?</AccordionTrigger>
            <AccordionContent>Yes. Set the typeface tokens after applying a theme, or add a pairing to the token package.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="shadcn">
            <AccordionTrigger>Does it work with existing shadcn/ui code?</AccordionTrigger>
            <AccordionContent>Colour variables use shadcn’s names, so existing components pick up the theme unchanged.</AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
  ],
});
