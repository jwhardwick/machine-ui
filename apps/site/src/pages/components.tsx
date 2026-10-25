import { CATEGORIES, COMPONENTS, loadDoc } from '@machine-ui/examples/catalog';
import { Badge, cn } from '@machine-ui/ui';
import { Suspense, use } from 'react';
import { Link } from 'react-router';
import { Loading } from '../site/loading.tsx';
import { PreviewFrame } from '../site/preview-frame.tsx';

/** A component's first example, loaded on demand so the page can list everything straight away. */
function FirstExample({ slug }: { slug: string }) {
  return use(loadDoc(slug)).examples[0]!.render();
}

export function ComponentsPage() {
  return (
    <div className="grid grid-cols-1 gap-12">
      <header className="grid grid-cols-1 max-w-2xl gap-4">
        <h1 className="font-display text-4xl font-semibold">Components</h1>
        <p className="text-lg text-muted-foreground">
          {COMPONENTS.length} components on shadcn/ui and Radix. Every one is styled with tokens only, so each follows the
          theme, and each is tested for keyboard use and accessibility.
        </p>
        <nav aria-label="Categories" className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="rounded-full focus-visible:outline-2 focus-visible:outline-ring">
              <Badge variant="outline" className="h-7 px-3 text-sm font-normal hover:bg-accent hover:text-accent-foreground">
                {c.label} <span className="text-muted-foreground">{COMPONENTS.filter((d) => d.category === c.id).length}</span>
              </Badge>
            </a>
          ))}
        </nav>
      </header>

      {CATEGORIES.map((category) => (
        <section key={category.id} id={category.id} className="grid grid-cols-1 scroll-mt-8 gap-6" aria-labelledby={`${category.id}-title`}>
          <h2 id={`${category.id}-title`} className="font-display text-2xl font-semibold">
            {category.label}
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {COMPONENTS.filter((d) => d.category === category.id).map((doc) => (
              <article key={doc.slug} className={cn('grid content-start gap-3', doc.wide && 'lg:col-span-2')}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium">
                    <Link to={`/components/${doc.slug}`} className="underline-offset-4 hover:underline">
                      {doc.name}
                    </Link>
                  </h3>
                  <Link to={`/components/${doc.slug}`} className="shrink-0 text-sm text-link underline-offset-4 hover:underline">
                    Details<span className="sr-only"> for {doc.name}</span>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">{doc.description}</p>
                <PreviewFrame>
                  <Suspense fallback={<Loading />}>
                    <FirstExample slug={doc.slug} />
                  </Suspense>
                </PreviewFrame>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
