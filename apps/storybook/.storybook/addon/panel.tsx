/** @jsxRuntime classic */
// Storybook's manager bundler compiles JSX to React.createElement without injecting React.
import * as React from 'react';
import { auditPalette, buildPalette, parseSeed, serializeSeed } from '@machine-ui/theme-engine';
import {
  DEFAULT_SEED,
  MOTION_LEVELS,
  NEUTRAL_TEMPERATURES,
  REFERENCE_THEMES,
  SEED_LIMITS,
  TYPE_PAIRS,
  type NumericSeedKey,
  type ThemeSeed,
} from '@machine-ui/tokens';
import { useGlobals } from 'storybook/manager-api';
import { MODE_GLOBAL, THEME_GLOBAL } from '../theme.ts';

const SLIDERS: { key: NumericSeedKey; label: string; step: number; hint: [string, string] }[] = [
  { key: 'hue', label: 'Brand hue', step: 1, hint: ['0°', '360°'] },
  { key: 'chroma', label: 'Chroma', step: 0.01, hint: ['muted', 'vivid'] },
  { key: 'radius', label: 'Radius', step: 0.01, hint: ['sharp', 'soft'] },
  { key: 'density', label: 'Density', step: 0.01, hint: ['compact', 'airy'] },
  { key: 'separation', label: 'Separation', step: 0.01, hint: ['borders', 'shadows'] },
  { key: 'typeRatio', label: 'Type scale ratio', step: 0.001, hint: ['1.125', '1.333'] },
];

const styles = {
  panel: { display: 'grid', gap: 16, padding: 16, fontSize: 13, maxWidth: 560 },
  row: { display: 'grid', gap: 6 },
  label: { display: 'flex', justifyContent: 'space-between', fontWeight: 600 },
  hint: { display: 'flex', justifyContent: 'space-between', opacity: 0.6, fontSize: 11 },
  inline: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  select: { padding: '4px 6px', fontSize: 13 },
  button: { padding: '4px 10px', fontSize: 13, cursor: 'pointer' },
} satisfies Record<string, React.CSSProperties>;

function Field({ label, value, children }: { label: string; value?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label style={styles.row}>
      <span style={styles.label}>
        {label}
        <span style={{ fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      </span>
      {children}
    </label>
  );
}

export function ThemePanel() {
  const [globals, updateGlobals] = useGlobals();
  const [copied, setCopied] = React.useState(false);
  const seed = parseSeed(globals[THEME_GLOBAL] as string | undefined) ?? DEFAULT_SEED;
  const encoded = serializeSeed(seed);

  const update = (patch: Partial<ThemeSeed>) => {
    const isPreset = 'name' in patch;
    updateGlobals({ [THEME_GLOBAL]: serializeSeed({ ...seed, ...patch, name: isPreset ? patch.name! : 'custom' }) });
  };

  const audit = React.useMemo(() => {
    const current = parseSeed(encoded) ?? DEFAULT_SEED;
    const results = (['light', 'dark'] as const).flatMap((mode) => auditPalette(buildPalette(current, mode)));
    return { passed: results.filter((r) => r.pass).length, total: results.length };
  }, [encoded]);

  const preset = REFERENCE_THEMES.find((t) => serializeSeed(t) === encoded)?.name ?? '';

  return (
    <div style={styles.panel}>
      <div style={styles.inline}>
        <Field label="Preset">
          <select
            style={styles.select}
            value={preset}
            onChange={(e) => {
              const next = REFERENCE_THEMES.find((t) => t.name === e.target.value);
              if (next) update({ ...next });
            }}
          >
            <option value="" disabled>
              custom
            </option>
            {REFERENCE_THEMES.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Mode">
          <select
            style={styles.select}
            value={globals[MODE_GLOBAL] === 'dark' ? 'dark' : 'light'}
            onChange={(e) => updateGlobals({ [MODE_GLOBAL]: e.target.value })}
          >
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </Field>
      </div>

      {SLIDERS.map(({ key, label, step, hint }) => (
        <Field key={key} label={label} value={key === 'hue' ? `${Math.round(seed.hue)}°` : seed[key].toFixed(key === 'typeRatio' ? 3 : 2)}>
          <input
            type="range"
            min={SEED_LIMITS[key][0]}
            max={SEED_LIMITS[key][1]}
            step={step}
            value={seed[key]}
            onChange={(e) => update({ [key]: Number(e.target.value) })}
          />
          <span style={styles.hint}>
            <span>{hint[0]}</span>
            <span>{hint[1]}</span>
          </span>
        </Field>
      ))}

      <div style={styles.inline}>
        <Field label="Neutrals">
          <select style={styles.select} value={seed.neutral} onChange={(e) => update({ neutral: e.target.value as ThemeSeed['neutral'] })}>
            {NEUTRAL_TEMPERATURES.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </Field>
        <Field label="Type pairing">
          <select style={styles.select} value={seed.typePair} onChange={(e) => update({ typePair: e.target.value as ThemeSeed['typePair'] })}>
            {Object.values(TYPE_PAIRS).map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Motion">
          <select style={styles.select} value={seed.motion} onChange={(e) => update({ motion: e.target.value as ThemeSeed['motion'] })}>
            {MOTION_LEVELS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
      </div>

      <div style={styles.inline}>
        <strong>
          Contrast: {audit.passed}/{audit.total} pairs pass (light + dark)
        </strong>
      </div>

      <div style={styles.inline}>
        <code style={{ fontSize: 11, wordBreak: 'break-all' }}>{encoded}</code>
      </div>
      <div style={styles.inline}>
        <button
          type="button"
          style={styles.button}
          onClick={async () => {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? 'Copied' : 'Copy share link'}
        </button>
        <button type="button" style={styles.button} onClick={() => updateGlobals({ [THEME_GLOBAL]: '' })}>
          Reset
        </button>
      </div>
    </div>
  );
}
