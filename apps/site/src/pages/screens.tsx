import { getMeta, SCREENS } from '@machine-ui/examples/catalog';
import { Badge } from '@machine-ui/ui';
import { Suspense } from 'react';
import { Link } from 'react-router';
import { Loading } from '../site/loading.tsx';
import { ScreenFrame } from '../site/preview-frame.tsx';

export function ScreensPage() {
  return (
    <div className="grid grid-cols-1 gap-16">
      <header className="grid grid-cols-1 max-w-2xl gap-4">
        <h1 className="font-display text-4xl font-semibold">Screens</h1>
        <p className="text-lg text-muted-foreground">
          Full app screens built only from machine-ui components, with no custom styles. They use whichever theme you’ve
          picked.
        </p>
      </header>
      {SCREENS.map((screen) => (
        <section key={screen.slug} id={screen.slug} className="grid grid-cols-1 scroll-mt-8 gap-4" aria-labelledby={`${screen.slug}-title`}>
          <div className="grid grid-cols-1 max-w-2xl gap-2">
            <h2 id={`${screen.slug}-title`} className="font-display text-2xl font-semibold">
              {screen.name}
            </h2>
            <p className="text-muted-foreground">{screen.description}</p>
            <p className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              Built from
              {screen.uses.map((slug) => (
                <Link key={slug} to={`/components/${slug}`}>
                  <Badge variant="outline" className="font-normal hover:bg-accent hover:text-accent-foreground">
                    {getMeta(slug)?.name ?? slug}
                  </Badge>
                </Link>
              ))}
            </p>
          </div>
          <ScreenFrame title={`app.pied-piper.dev/${screen.slug}`}>
            <Suspense fallback={<Loading className="h-full" />}>
              <screen.Component />
            </Suspense>
          </ScreenFrame>
        </section>
      ))}
    </div>
  );
}
