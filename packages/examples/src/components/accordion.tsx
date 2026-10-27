import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'accordion',
  name: 'Accordion',
  category: 'layout',
  description: 'A stack of headings that each open a section. You can allow one section or several to be open at once.',
  examples: [
    {
      name: 'FAQ',
      render: () => (
        <Accordion type="single" collapsible defaultValue="main" className="w-full max-w-md">
          <AccordionItem value="main">
            <AccordionTrigger>Can the agent push to main?</AccordionTrigger>
            <AccordionContent>
              No. It works on its own branch, runs your checks, and opens a pull request for you to review.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="checks">
            <AccordionTrigger>What happens when a check fails?</AccordionTrigger>
            <AccordionContent>It reads the failure, tries a fix, and runs the check again. After three tries it stops and asks you.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="secrets">
            <AccordionTrigger>Can it see my secrets?</AccordionTrigger>
            <AccordionContent>Only the ones you add to a session. They’re masked in logs and never written to the repo.</AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
  ],
});
