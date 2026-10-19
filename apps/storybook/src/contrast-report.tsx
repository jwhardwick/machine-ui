import { auditPalette, buildPalette, formatOklch, type Mode } from '@machine-ui/theme-engine';
import type { ThemeSeed } from '@machine-ui/tokens';

function Swatch({ color }: { color: string }) {
  return <span aria-hidden className="inline-block size-4 rounded-sm border align-middle" style={{ background: color }} />;
}

export function ContrastReport({ seed }: { seed: ThemeSeed }) {
  return (
    <div className="grid gap-8">
      {(['light', 'dark'] as Mode[]).map((mode) => {
        const palette = buildPalette(seed, mode);
        const results = auditPalette(palette);
        const passed = results.filter((r) => r.pass).length;
        return (
          <section key={mode} className="grid gap-3">
            <h2 className="font-display text-xl">
              {seed.name} · {mode} · {passed}/{results.length} pairs pass
            </h2>
            <table className="w-full max-w-3xl border-collapse text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4 font-medium">Foreground</th>
                  <th className="py-2 pr-4 font-medium">Background</th>
                  <th className="py-2 pr-4 font-medium">Kind</th>
                  <th className="py-2 pr-4 font-medium">WCAG</th>
                  <th className="py-2 pr-4 font-medium">APCA Lc</th>
                  <th className="py-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={`${r.fg}/${r.bg}`} data-pass={r.pass} className="border-t">
                    <td className="py-2 pr-4">
                      <Swatch color={formatOklch(palette[r.fg])} /> {r.fg}
                    </td>
                    <td className="py-2 pr-4">
                      <Swatch color={formatOklch(palette[r.bg])} /> {r.bg}
                    </td>
                    <td className="py-2 pr-4">{r.kind}</td>
                    <td className="py-2 pr-4 font-mono">
                      {r.ratio.toFixed(2)} / {r.target}
                    </td>
                    <td className="py-2 pr-4 font-mono">{Math.abs(r.apca).toFixed(0)}</td>
                    <td className="py-2">{r.pass ? 'Pass' : 'Fail'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
}
