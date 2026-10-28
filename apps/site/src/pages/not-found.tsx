import { Button, Empty, EmptyActions, EmptyDescription, EmptyTitle } from '@machine-ui/ui';
import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <Empty className="min-h-96">
      <EmptyTitle>
        <h1>There’s no page here</h1>
      </EmptyTitle>
      <EmptyDescription>The link might be out of date. Press ⌘K to search, or browse the components.</EmptyDescription>
      <EmptyActions>
        <Button asChild>
          <Link to="/components">Browse components</Link>
        </Button>
      </EmptyActions>
    </Empty>
  );
}
