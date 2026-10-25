import { cn } from '@machine-ui/ui';

/** Holds a lazy page or preview's space while its code loads. Tests and the axe run wait until none are left. */
export function Loading({ className }: { className?: string }) {
  return (
    <div data-loading aria-busy="true" className={cn('min-h-48', className)}>
      <span className="sr-only">Loading</span>
    </div>
  );
}
