import { auditPalette, buildPalette, formatOklch, type Mode } from '@machine-ui/theme-engine';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@machine-ui/ui';
import { useMemo } from 'react';
import { Controls } from '../controls.tsx';
import { ExportPanel } from '../export-panel.tsx';
import { useSiteTheme } from '../site/theme.tsx';

function ContrastTable({ mode }: { mode: Mode }) {
  const { seed } = useSiteTheme();
  const { palette, results } = useMemo(() => {
    const p = buildPalette(seed, mode);
    return { palette: p, results: auditPalette(p) };
  }, [seed, mode]);
  const passed = results.filter((r) => r.pass).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{mode === 'light' ? 'Light mode' : 'Dark mode'}</CardTitle>
          <Badge variant={passed === results.length ? 'secondary' : 'destructive'}>
            {passed}/{results.length} pass
          </Badge>
        </div>
        <CardDescription>WCAG 2.2: 4.5:1 for text, 3:1 for control boundaries. APCA shown for reference.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead className="text-right">Ratio</TableHead>
              <TableHead className="text-right">APCA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((r) => (
              <TableRow key={`${r.fg}/${r.bg}`}>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="flex">
                      <span className="size-4 rounded-l-sm border" style={{ background: formatOklch(palette[r.bg]) }} />
                      <span className="size-4 rounded-r-sm border border-l-0" style={{ background: formatOklch(palette[r.fg]) }} />
                    </span>
                    {r.fg} <span className="text-muted-foreground">on</span> {r.bg}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {r.ratio.toFixed(2)}
                  <span className="sr-only">{r.pass ? ', passes' : ', fails'}</span>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-muted-foreground">{Math.abs(r.apca).toFixed(0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function ThemesPage() {
  const { seed, setSeed } = useSiteTheme();
  return (
    <div className="grid grid-cols-1 gap-10">
      <header className="grid grid-cols-1 max-w-2xl gap-4">
        <h1 className="font-display text-4xl font-semibold">Themes</h1>
        <p className="text-lg text-muted-foreground">
          Move the settings and the whole site follows. Every colour pair is solved for contrast as you go, in light and dark.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[18rem_1fr]">
        <aside className="lg:sticky lg:top-8 lg:self-start" aria-label="Theme settings">
          <Controls seed={seed} onChange={setSeed} />
        </aside>
        <div className="grid grid-cols-1 min-w-0 content-start gap-6">
          <ExportPanel seed={seed} />
          <div className="grid grid-cols-1 gap-6">
            <ContrastTable mode="light" />
            <ContrastTable mode="dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
