import {
  MOTION_LEVELS,
  NEUTRAL_TEMPERATURES,
  REFERENCE_THEMES,
  SEED_LIMITS,
  TYPE_PAIRS,
  type NumericSeedKey,
  type ThemeSeed,
} from '@machine-ui/tokens';
import { Button, Label, cn } from '@machine-ui/ui';
import { useId, type ReactNode } from 'react';

const SLIDERS: { key: NumericSeedKey; label: string; step: number; ends: [string, string] }[] = [
  { key: 'hue', label: 'Brand hue', step: 1, ends: ['0°', '360°'] },
  { key: 'chroma', label: 'Colourfulness', step: 0.01, ends: ['Muted', 'Vivid'] },
  { key: 'radius', label: 'Corners', step: 0.01, ends: ['Sharp', 'Soft'] },
  { key: 'density', label: 'Density', step: 0.01, ends: ['Compact', 'Airy'] },
  { key: 'separation', label: 'Separation', step: 0.01, ends: ['Borders', 'Shadows'] },
  { key: 'typeRatio', label: 'Type scale', step: 0.001, ends: ['Even', 'Dramatic'] },
];

const selectClass =
  'h-(--control-md) w-full rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

function Field({ label, htmlFor, value, children }: { label: string; htmlFor: string; value?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={htmlFor}>{label}</Label>
        {value && <span className="font-mono text-xs text-muted-foreground">{value}</span>}
      </div>
      {children}
    </div>
  );
}

function formatValue(key: NumericSeedKey, seed: ThemeSeed) {
  if (key === 'hue') return `${Math.round(seed.hue)}°`;
  if (key === 'typeRatio') return seed.typeRatio.toFixed(3);
  return `${Math.round(seed[key] * 100)}%`;
}

export function Controls({ seed, onChange }: { seed: ThemeSeed; onChange: (seed: ThemeSeed) => void }) {
  const id = useId();
  const update = (patch: Partial<ThemeSeed>) => onChange({ ...seed, ...patch, name: 'custom' });

  return (
    <div className="grid gap-6">
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">Start from</legend>
        <div className="flex flex-wrap gap-2">
          {REFERENCE_THEMES.map((preset) => (
            <Button
              key={preset.name}
              size="sm"
              variant={preset.name === seed.name ? 'default' : 'outline'}
              aria-pressed={preset.name === seed.name}
              onClick={() => onChange(preset)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </fieldset>

      {SLIDERS.map(({ key, label, step, ends }) => (
        <Field key={key} label={label} htmlFor={`${id}-${key}`} value={formatValue(key, seed)}>
          <input
            id={`${id}-${key}`}
            type="range"
            className="w-full accent-primary"
            min={SEED_LIMITS[key][0]}
            max={SEED_LIMITS[key][1]}
            step={step}
            value={seed[key]}
            onChange={(e) => update({ [key]: Number(e.target.value) })}
          />
          <div className="flex justify-between text-xs text-muted-foreground" aria-hidden>
            <span>{ends[0]}</span>
            <span>{ends[1]}</span>
          </div>
        </Field>
      ))}

      <Field label="Neutrals" htmlFor={`${id}-neutral`}>
        <select
          id={`${id}-neutral`}
          className={selectClass}
          value={seed.neutral}
          onChange={(e) => update({ neutral: e.target.value as ThemeSeed['neutral'] })}
        >
          {NEUTRAL_TEMPERATURES.map((n) => (
            <option key={n} value={n}>
              {n[0]!.toUpperCase() + n.slice(1)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Type pairing" htmlFor={`${id}-type`}>
        <select
          id={`${id}-type`}
          className={selectClass}
          value={seed.typePair}
          onChange={(e) => update({ typePair: e.target.value as ThemeSeed['typePair'] })}
        >
          {Object.values(TYPE_PAIRS).map((pair) => (
            <option key={pair.id} value={pair.id}>
              {pair.label}
            </option>
          ))}
        </select>
      </Field>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">Motion</legend>
        <div className="flex gap-2">
          {MOTION_LEVELS.map((level) => (
            <Button
              key={level}
              size="sm"
              variant={seed.motion === level ? 'secondary' : 'ghost'}
              aria-pressed={seed.motion === level}
              className={cn('flex-1 capitalize', seed.motion === level && 'border border-input')}
              onClick={() => update({ motion: level })}
            >
              {level}
            </Button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
