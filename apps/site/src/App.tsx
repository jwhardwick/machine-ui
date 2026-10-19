import { auditPalette, buildPalette } from '@machine-ui/theme-engine';
import { Badge, Button } from '@machine-ui/ui';
import { Check, Link2, Moon, Sun } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controls } from './controls.tsx';
import { ExportPanel } from './export-panel.tsx';
import { Preview } from './preview.tsx';
import { usePlayground } from './use-playground.ts';

export function App() {
  const [{ seed, mode }, setState] = usePlayground();
  const [copied, setCopied] = useState(false);

  const contrast = useMemo(() => {
    const results = (['light', 'dark'] as const).flatMap((m) => auditPalette(buildPalette(seed, m)));
    return { passed: results.filter((r) => r.pass).length, total: results.length };
  }, [seed]);

  return (
    <div className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-xl font-semibold">machine-ui</span>
            <span className="hidden text-sm text-muted-foreground sm:inline">theme playground</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setState((s) => ({ ...s, mode: s.mode === 'dark' ? 'light' : 'dark' }))}
            >
              {mode === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? <Check aria-hidden /> : <Link2 aria-hidden />}
              {copied ? 'Link copied' : 'Share theme'}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[18rem_1fr]">
        <section className="grid content-start gap-8" aria-labelledby="intro">
          <div className="grid gap-3">
            <h1 id="intro" className="text-3xl font-semibold">
              Make it look like yours.
            </h1>
            <p className="text-muted-foreground">
              Pick a few personality settings. The engine generates every colour, size and curve, and solves each text
              pair for contrast before you see it.
            </p>
            <div>
              <Badge variant={contrast.passed === contrast.total ? 'outline' : 'destructive'}>
                {contrast.passed}/{contrast.total} contrast pairs pass
              </Badge>
            </div>
          </div>
          <Controls seed={seed} onChange={(next) => setState((s) => ({ ...s, seed: next }))} />
        </section>

        <div className="grid min-w-0 content-start gap-10">
          <Preview />
          <ExportPanel seed={seed} />
        </div>
      </main>
    </div>
  );
}
