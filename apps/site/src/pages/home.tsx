import { auditPalette, buildPalette } from '@machine-ui/theme-engine';
import { CATEGORIES, COMPONENT_DOCS, SCREENS } from '@machine-ui/examples';
import { REFERENCE_THEMES } from '@machine-ui/tokens';
import { Button, CodeBlock, ToggleGroup, ToggleGroupItem } from '@machine-ui/ui';
import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { registryEntry } from '../site/install-prompt.ts';
import { ScreenFrame } from '../site/preview-frame.tsx';
import { Specimen } from '../site/specimen.tsx';
import { useSiteTheme } from '../site/theme.tsx';

export function HomePage() {
  const { seed } = useSiteTheme();
  const [screen, setScreen] = useState(SCREENS[0]!.slug);
  const current = SCREENS.find((s) => s.slug === screen)!;
  const contrast = useMemo(() => {
    const results = (['light', 'dark'] as const).flatMap((m) => auditPalette(buildPalette(seed, m)));
    return { passed: results.filter((r) => r.pass).length, total: results.length };
  }, [seed]);

  return (
    <div className="grid grid-cols-1 gap-20">
      <section className="grid grid-cols-1 gap-8" aria-labelledby="hero">
        <div className="grid grid-cols-1 max-w-2xl gap-5">
          <h1 id="hero" className="font-display text-4xl font-semibold leading-[1.05] text-balance">
            Make shadcn/ui look like your own
          </h1>
          <p className="text-lg text-muted-foreground">
            machine-ui is a shadcn/ui kit with a theme generator. You set a few options, and it builds the colours, type, and
            spacing, adjusting every colour pair until the contrast passes. Pick a theme to restyle this site.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" role="group" aria-label="Themes">
          {REFERENCE_THEMES.map((preset) => (
            <Specimen key={preset.name} seed={preset} />
          ))}
        </div>
        <dl className="grid max-w-2xl grid-cols-3 gap-6 border-t pt-6">
          <div>
            <dt className="text-sm text-muted-foreground">Components</dt>
            <dd className="font-display text-3xl font-semibold tabular-nums">{COMPONENT_DOCS.length}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Themes</dt>
            <dd className="font-display text-3xl font-semibold tabular-nums">{REFERENCE_THEMES.length}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Contrast checks passed</dt>
            <dd className="font-display text-3xl font-semibold tabular-nums">
              {contrast.passed}/{contrast.total}
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid grid-cols-1 gap-6" aria-labelledby="screens">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid grid-cols-1 max-w-xl gap-2">
            <h2 id="screens" className="font-display text-3xl font-semibold">
              Example screens
            </h2>
            <p className="text-muted-foreground">
              These screens use only machine-ui components. Switch themes to see how different the same app can look.
            </p>
          </div>
          <div className="max-w-full overflow-x-auto">
            <ToggleGroup type="single" variant="outline" value={screen} onValueChange={(v) => v && setScreen(v)} aria-label="Screen">
              {SCREENS.map((s) => (
                <ToggleGroupItem key={s.slug} value={s.slug}>
                  {s.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        <ScreenFrame title={`app.northwind.dev/${current.slug}`}>
          <current.Component />
        </ScreenFrame>
      </section>

      <section className="grid grid-cols-1 gap-6" aria-labelledby="components">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="components" className="font-display text-3xl font-semibold">
            The shadcn/ui components, plus some for AI apps
          </h2>
          <Button asChild variant="outline">
            <Link to="/components">
              Browse all {COMPONENT_DOCS.length} <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="grid grid-cols-1 content-start gap-2">
              <h3 className="text-sm font-medium">{category.label}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {COMPONENT_DOCS.filter((d) => d.category === category.id).map((doc, i, all) => (
                  <span key={doc.slug}>
                    <Link to={`/components/${doc.slug}`} className="text-foreground underline-offset-4 hover:underline">
                      {doc.name}
                    </Link>
                    {i < all.length - 1 && ', '}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center" aria-labelledby="install">
        <div className="grid grid-cols-1 gap-3">
          <h2 id="install" className="font-display text-3xl font-semibold">
            Install
          </h2>
          <p className="text-muted-foreground">
            Add the registry to your shadcn/ui config, install your theme, then add components as you need them. You can also
            copy the install prompt from the toolbar and give it to your coding agent.
          </p>
          <div>
            <Button asChild variant="link" className="px-0">
              <Link to="/get-started">Read the setup guide</Link>
            </Button>
          </div>
        </div>
        <CodeBlock
          filename="terminal"
          code={`# components.json → ${registryEntry(window.location.origin)}
npx shadcn@latest add @machine-ui/theme-${seed.name}
npx shadcn@latest add @machine-ui/button @machine-ui/card`}
        />
      </section>
    </div>
  );
}
