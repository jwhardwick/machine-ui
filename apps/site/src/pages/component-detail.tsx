import { CATEGORIES, COMPONENTS, getMeta, installCommand, loadDoc, loadSource, SCREENS } from '@machine-ui/examples/catalog';
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  CodeBlock,
  CopyInput,
} from '@machine-ui/ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Suspense, use } from 'react';
import { Link, useParams } from 'react-router';
import { Loading } from '../site/loading.tsx';
import { PreviewFrame } from '../site/preview-frame.tsx';
import { NotFoundPage } from './not-found.tsx';

function Examples({ slug }: { slug: string }) {
  return use(loadDoc(slug)).examples.map((example) => (
    <section key={example.name} className="grid grid-cols-1 gap-3" aria-labelledby={`ex-${example.name}`}>
      <h2 id={`ex-${example.name}`} className="font-medium">
        {example.name}
      </h2>
      <PreviewFrame className="min-h-64">{example.render()}</PreviewFrame>
    </section>
  ));
}

function Source({ slug }: { slug: string }) {
  return <CodeBlock filename={`examples/${slug}.tsx`} code={use(loadSource(slug))} className="[&_pre]:max-h-[32rem]" />;
}

export function ComponentDetailPage() {
  const { slug = '' } = useParams();
  const doc = getMeta(slug);
  if (!doc) return <NotFoundPage />;

  const index = COMPONENTS.indexOf(doc);
  const previous = COMPONENTS[index - 1];
  const next = COMPONENTS[index + 1];
  const category = CATEGORIES.find((c) => c.id === doc.category)!;
  const usedIn = SCREENS.filter((s) => s.uses.includes(doc.slug));

  return (
    <article className="grid grid-cols-1 gap-10">
      <header className="grid grid-cols-1 max-w-2xl gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/components">Components</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/components#${category.id}`}>{category.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{doc.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-display text-4xl font-semibold">{doc.name}</h1>
        <p className="text-lg text-muted-foreground">{doc.description}</p>
        {usedIn.length > 0 && (
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Used in
            {usedIn.map((s) => (
              <Link key={s.slug} to={`/screens#${s.slug}`}>
                <Badge variant="outline" className="hover:bg-accent hover:text-accent-foreground">
                  {s.name}
                </Badge>
              </Link>
            ))}
          </p>
        )}
      </header>

      <section className="grid max-w-2xl gap-2" aria-labelledby="install">
        <h2 id="install" className="font-medium">
          Install
        </h2>
        <CopyInput aria-label="Install command" value={installCommand(doc.slug)} />
        <p className="text-sm text-muted-foreground">
          This copies the component’s source into your project. If you haven’t set up machine-ui yet, follow{' '}
          <Link to="/get-started" className="text-link underline underline-offset-4">
            Get started
          </Link>{' '}
          first.
        </p>
      </section>

      <Suspense fallback={<Loading className="min-h-64" />}>
        <Examples slug={doc.slug} />
      </Suspense>

      <section className="grid grid-cols-1 gap-3" aria-labelledby="source">
        <h2 id="source" className="font-medium">
          Example source
        </h2>
        <Suspense fallback={<Loading />}>
          <Source slug={doc.slug} />
        </Suspense>
      </section>

      <nav aria-label="More components" className="flex justify-between gap-4 border-t pt-6">
        {previous ? (
          <Button asChild variant="ghost">
            <Link to={`/components/${previous.slug}`}>
              <ArrowLeft aria-hidden /> {previous.name}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button asChild variant="ghost">
            <Link to={`/components/${next.slug}`}>
              {next.name} <ArrowRight aria-hidden />
            </Link>
          </Button>
        )}
      </nav>
    </article>
  );
}
