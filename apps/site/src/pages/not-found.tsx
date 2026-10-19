import { Button, Empty, EmptyActions, EmptyDescription, EmptyTitle } from '@machine-ui/ui';
import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <Empty className="min-h-96">
      <EmptyTitle>There’s no page here</EmptyTitle>
      <EmptyDescription>The link may be old. Search with ⌘K, or start from the components index.</EmptyDescription>
      <EmptyActions>
        <Button asChild>
          <Link to="/components">Browse components</Link>
        </Button>
      </EmptyActions>
    </Empty>
  );
}
