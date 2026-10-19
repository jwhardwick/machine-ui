import { ExternalLinkIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.tsx';

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

/** A numbered marker in the text that previews its source on hover or focus. */
export function Citation({ index, source, className }: { index: number; source: Source; className?: string }) {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a
          href={source.url}
          data-slot="citation"
          aria-label={`Source ${index}: ${source.title}`}
          className={cn(
            'mx-0.5 inline-flex h-4 min-w-4 -translate-y-1 items-center justify-center rounded-sm bg-muted px-1 align-baseline font-mono text-xs font-medium text-foreground no-underline hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring',
            className,
          )}
        >
          {index}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="grid w-72 gap-1 text-sm">
        <span className="font-medium">{source.title}</span>
        <span className="truncate text-xs text-muted-foreground">{new URL(source.url).host}</span>
        {source.snippet && <span className="text-muted-foreground">{source.snippet}</span>}
      </HoverCardContent>
    </HoverCard>
  );
}

/** The list of sources an answer drew on. */
export function Sources({ sources, className, ...props }: ComponentProps<'div'> & { sources: Source[] }) {
  return (
    <div data-slot="sources" className={cn('grid gap-2', className)} {...props}>
      <p className="text-xs font-medium text-muted-foreground">Sources</p>
      <ol className="flex flex-wrap gap-2">
        {sources.map((source, i) => (
          <li key={source.url}>
            <a
              href={source.url}
              className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="font-mono text-muted-foreground">{i + 1}</span>
              {source.title}
              <ExternalLinkIcon aria-hidden className="size-3 text-muted-foreground" />
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
