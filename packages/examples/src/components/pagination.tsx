import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'pagination',
  name: 'Pagination',
  category: 'navigation',
  description: 'Moves through pages of results with numbered links, previous and next.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#page-1" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-1">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-2" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-3">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#page-3" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ),
    },
  ],
});
