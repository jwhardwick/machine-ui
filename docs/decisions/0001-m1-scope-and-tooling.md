# 0001: M1 scope and tooling defaults

Date: 2026-10-19 · Status: accepted

Questions the spec leaves open, and the defaults chosen. All are cheap to reverse.

| Question | Default | Why |
| --- | --- | --- |
| TypeScript 7 or 6? | 6.0 | typescript-eslint 8.x peers on `<6.1`. Revisit when it supports 7. |
| How are packages consumed? | Workspace packages export TS source (`exports: ./src/index.ts`). | Storybook and the site bundle with Vite. A build step lands with npm publishing (M2/M3). |
| P3 colour output? | Deferred. | The spec marks it optional. Contrast is solved in sRGB; P3 values need their own verification pass. |
| Which CI gates exist in M1? | typecheck, lint (incl. tokens-only), unit + contrast tests, Storybook interaction + axe, site build. | These are the commands CLAUDE.md lists for M1. Visual diffs, size-limit, API Extractor and the changeset bot belong to the M2 agent pipeline. |
| Reference themes? | ledger (editorial), concrete (brutalist), meadow (soft consumer), console (dense dashboard), ember (expressive). | Spec: "I don't mind". Five themes spread across all personality axes. |
| Where do generated reference CSS files live? | `packages/tokens/css/themes/*.css`, written by `theme-engine`'s `build:css`, with a drift test. | Tokens owns CSS output; the engine owns generation. Avoids a circular dependency. |
| Engine variable names vs Tailwind namespaces | `--type-*`, `--corner-*`, `--typeface-*`, `--elevation-*`, `--space-unit`, `--motion-*`; colour roles keep shadcn names. | `@theme inline { --text-base: var(--text-base) }` would be self-referential. |
| No git remote | Work happens on `m1/theme-engine`; no PR can be opened until a remote exists. | Repo was not initialised. |
