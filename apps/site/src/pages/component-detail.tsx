import { CATEGORIES, COMPONENT_DOCS, getDoc, getSource, SCREENS } from '@machine-ui/examples';
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
} from '@machine-ui/ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { PreviewFrame } from '../site/preview-frame.tsx';
import { NotFoundPage } from './not-found.tsx';

export function ComponentDetailPage() {
  const { slug = '' } = useParams();
  const doc = getDoc(slug);
  if (!doc) return <NotFoundPage />;

  const index = COMPONENT_DOCS.indexOf(doc);
  const previous = COMPONENT_DOCS[index - 1];
  const next = COMPONENT_DOCS[index + 1];
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

      {doc.examples.map((example) => (
        <section key={example.name} className="grid grid-cols-1 gap-3" aria-labelledby={`ex-${example.name}`}>
          <h2 id={`ex-${example.name}`} className="font-medium">
            {example.name}
          </h2>
          <PreviewFrame className="min-h-64">{example.render()}</PreviewFrame>
        </section>
      ))}

      <section className="grid grid-cols-1 gap-3" aria-labelledby="source">
        <h2 id="source" className="font-medium">
          Example source
        </h2>
        <CodeBlock filename={`examples/${doc.slug}.tsx`} code={getSource(doc.slug) ?? ''} className="[&_pre]:max-h-[32rem]" />
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
