# Design System Agent — Spec

Oct 19, 2026 · @Jimmy

## Overview

Build a theming-first design system on shadcn/ui, plus a shareable agent that maintains it from an issue board with minimal human input. The system makes sites look distinct; the agent proves that AI can run a design system safely.

**Goals**

- A theme engine that generates a unique, accessible palette and type system, editable live at runtime.
- An agent that turns issues into merged, released changes, gated by deterministic checks.
- Consumer skills so any coding agent installs and uses the system correctly.
- Packaged so another team can point the agent at their own shadcn-based design system.

**Non-goals (v1)**

- Replacing shadcn/Radix primitives or building components from scratch.
- A large AI-pattern catalogue. Existing kits already cover that; this project competes on theming and maintenance.
- Non-React frameworks.

**Positioning.** Existing agent-installable kits ship a swappable accent, font and motion switches. This project goes deeper on two axes they leave open: generated themes with guaranteed contrast and "personality" controls, and an autonomous maintenance pipeline. One line: *other kits make a prototype look designed; this makes it look like yours, and keeps itself healthy.*

## System architecture

One monorepo holds the design system, the theme engine and the agent package; the agent runtime runs on the VPS and talks to GitHub.

| Package | Purpose | Ships as |
| --- | --- | --- |
| `@ds/tokens` | Token schema, default themes, CSS variable output | npm + CSS file |
| `@ds/theme-engine` | Palette and type generation, contrast solver, runtime apply | npm (framework-agnostic TS) |
| `@ds/ui` | Wrapped shadcn components consuming tokens only | shadcn registry + npm |
| `apps/storybook` | Docs, live theme editor addon, visual test target | Static site |
| `apps/site` | Public site: theme playground, install prompt, llms.txt | Static site |
| `agent/` | Skills, subagents, hooks, CI workflows, runner config | Claude Code plugin + template repo |

**Runtime.** The agent runs headless Claude Code on the VPS, triggered by GitHub webhooks (or a polling loop as fallback). It works in a fresh git worktree per issue and pushes branches; CI on GitHub Actions is the source of truth for every gate.

**Trust boundary.** The agent can open PRs, comment and label. It cannot push to `main`, publish to npm, or change CI config. Releases run from a protected workflow.

## Theme engine

A theme is a small seed (brand hue, neutral temperature, a few personality settings) that expands into a full, contrast-safe token set, applied at runtime as CSS custom properties.

**Inputs (the seed)**

| Axis | Range | Drives |
| --- | --- | --- |
| Brand hue + chroma | OKLCH hue 0–360, chroma low–high | Primary and accent scales |
| Neutral temperature | cool / neutral / warm | Grey scale tint |
| Radius | sharp → soft | `--radius-*` |
| Density | compact → airy | Spacing scale, control heights |
| Separation | borders ↔ shadows | Card, input and popover surfaces |
| Type pairing | curated pairs (display + text) | `--font-*` |
| Type scale ratio | e.g. 1.125 → 1.333 | Fluid `clamp()` sizes |
| Motion | none / subtle / expressive | Duration and easing tokens |

**Palette generation**

1. Generate 11-step tonal scales in OKLCH so lightness steps are perceptually even across hues.
2. Clamp chroma to the sRGB gamut per step (with optional P3 values behind `@media (color-gamut: p3)`).
3. Map scales to semantic roles (`background`, `foreground`, `primary`, `muted`, `border`, `destructive`, etc.) using shadcn's variable names, so output drops into any shadcn project.
4. **Solve for contrast, don't check after.** For each required pair, search lightness until it meets WCAG 2.2 targets: 4.5:1 body text, 3:1 large text and UI boundaries. Report APCA Lc alongside as advisory.
5. Generate light and dark modes from the same seed.

**Runtime apply**

- `applyTheme(seed)` computes tokens and writes them to `:root` (or a scoped element) as CSS variables. No rebuild, no Tailwind recompile.
- `exportTheme(seed)` emits a CSS file, a JSON token file, and a short design brief for agents (see Distribution).
- Seeds serialise to a URL param so themes are shareable links.

**Output format: hybrid.** The engine writes plain semantic CSS variables (`--primary`, `--radius`) to `:root`. The package ships a static `@theme inline` file mapping them to Tailwind utilities (`--color-primary: var(--primary)`). Utilities reference the variables, so runtime theme changes flow through, and non-Tailwind consumers use the variables directly. Never put literal values inside `@theme inline`: they get baked into utilities and break runtime theming.

**Storybook live editing.** A toolbar addon exposes the seed controls; changes call `applyTheme` in the preview iframe so every story updates live. A "theme matrix" story renders key components across 4–6 reference themes side by side.

**Anti-slop defaults.** No default theme ships with Inter, purple-to-blue gradients or maximum radius. Curated type pairs and the personality axes are the primary way themes diverge.

## Agent workflow

An issue becomes a released change through one loop, and the agent can only advance it by passing gates.

```
Issue labelled agent:ready → Plan comment (human can redirect) → Implement (fresh worktree) → Open PR (all CI gates run)
  → Gates green?
      no  → Agent fixes (reads gate output) → retry Implement; on 3rd failure → Escalate (label needs-human)
      yes → Compute bump (API + token diff)
              → Patch: auto-merge | Minor: one human review | Major: human approval + migration guide
```

The agent retries a failing gate up to three times, then labels the issue `needs-human` and stops.

**Intake.** GitHub Issues first; Jira later via MCP, mapped to the same task shape (title, body, acceptance criteria, labels). Issue templates require acceptance criteria. Only issues a maintainer labels `agent:ready` are picked up.

**Plan comment.** Before coding, the agent posts scope, files to touch, accessibility considerations, expected version bump and open questions. Any maintainer objection pauses the run; no reply within a configurable window (default 2 hours) means proceed.

**Self-generated work.** The agent may open issues itself (flaky tests, deprecation removals, audit findings), but they still need a maintainer's `agent:ready` label.

**Autonomy thresholds** live in `config.yaml`, so a new team can start with every level set to review-required and loosen it as trust builds.

## Agent skills

Two skill sets: maintainer skills the agent uses to change the system, and consumer skills any coding agent uses to adopt it.

**Maintainer skills (in the agent plugin)**

| Skill | What it encodes |
| --- | --- |
| `ds-component` | Wrap a shadcn/Radix primitive; tokens-only styling; variant API conventions (`cva`); forwardRef and `asChild`; file layout |
| `ds-a11y` | Keyboard maps per pattern (WAI-ARIA APG), focus management, labelling, reduced motion, colour not the only signal |
| `ds-tokens` | Adding or renaming tokens, deprecation aliases, theme-engine role mapping |
| `ds-performance` | Tree-shakeable exports, no runtime CSS-in-JS, size budgets, avoiding re-render traps in compound components |
| `ds-docs` | Story per variant and state, interaction tests, MDX usage notes, do/don't examples |
| `ds-release` | Reading the API and token diff, writing changesets and migration notes |
| `ds-triage` | Turning an issue into a plan comment: scope, files, risks, expected version bump |

**Consumer skills (shipped with the package)**

| Skill | What it encodes |
| --- | --- |
| `use-ds-install` | Detect the project (Next, Vite), add the registry, install base components, wire fonts and the theme CSS |
| `use-ds-theme` | Generate a seed from a brief ("calm, editorial, warm"), export, apply |
| `use-ds-compose` | Page composition patterns: layout, forms, data display; which component for which job |
| `use-ds-migrate` | Replace hardcoded styles and ad-hoc components in an existing app, screen by screen |

Every skill ends with a **verification step** the agent must run (lint, test, or screenshot) before declaring done.

## CI pipeline and quality gates

Every PR, human or agent, passes the same deterministic gates; the agent never self-certifies.

| Gate | Tool | Fails when |
| --- | --- | --- |
| Types | `tsc --noEmit` | Any type error |
| Lint | ESLint + custom token rule | Raw colours, px values or font names outside `@ds/tokens` |
| Unit | Vitest | Theme engine or utility tests fail |
| Contrast | Theme-engine test suite | Any reference theme pair below WCAG target |
| Interaction | Storybook test runner | A story's play function fails |
| Accessibility | axe via Storybook test runner | Any serious or critical violation |
| Visual | Playwright screenshots across the theme matrix | Unapproved pixel diff in any theme, light or dark |
| Bundle | size-limit | A component exceeds its budget |
| API surface | API Extractor report | Report changed without a matching changeset |
| Changeset | Changesets bot | User-facing change with no changeset |

**Visual baselines.** Screenshot diffs post to the PR as an image grid. Only a human can approve a new baseline; the agent can propose one with an explanation.

**Flake policy.** A gate that fails then passes on retry is logged; three flakes in a week opens an issue for the agent to fix the test.

## Versioning and release

Tooling computes the version bump; the agent explains it. The model never guesses semver.

**Bump rules**

| Change detected | Bump |
| --- | --- |
| Export removed or renamed; prop removed, renamed or narrowed; required prop added | Major |
| Token removed or renamed (without a deprecation alias) | Major |
| Default visual change to an existing component beyond a set pixel threshold | Major (flagged for human judgement) |
| New export, new optional prop, new variant, new token | Minor |
| Token value change within a theme, bug fix, docs, internal refactor | Patch |

**How it's computed**

1. API Extractor generates `api-report.md` per package; a script diffs it against `main` and classifies each change.
2. A token diff script compares the token schema and flags removals and renames.
3. The highest classification wins and is posted as a PR check: `version: minor (2 new exports)`.
4. The agent writes the changeset at that level, plus migration notes for any major, with before/after code.

**Deprecation path.** Renames ship as minor with an alias and a dev-time console warning; the alias is removed in the next major. The agent opens the removal issue automatically.

**Release.** Changesets opens a "Version packages" PR. Merging it triggers a protected workflow that publishes to npm, updates the shadcn registry, tags the release and regenerates `llms.txt` and docs.

## Agent-readable docs and distribution

Every machine-readable doc is generated from source on release, so it can't drift.

**Generated artefacts**

- `llms.txt` and `llms-full.txt`: component index, props, variants, usage rules.
- `install.md`: the step-by-step agent install guide (mirrors the `use-ds-install` skill).
- `theme-brief.md`: exported with each theme; tells an agent the theme's personality and do/don't rules ("borders not shadows, sharp corners, no gradients").
- Optional small MCP server exposing `list_components`, `get_component`, `get_tokens`, `generate_theme`.

**Install paths**

1. **Copy prompt** on the site, pasted into any coding agent.
2. `npx shadcn add <registry-url>/<component>` for component-by-component adoption.
3. `npm i @ds/ui @ds/theme-engine` for full package use.

**Sharing the agent.** The maintainer agent ships as a Claude Code plugin (skills, subagents, hooks) plus a template repo with the CI workflows. A `config.yaml` points it at a target design system: package paths, issue source, autonomy thresholds, reference themes.

## Milestones, success metrics, open questions

Ship in three milestones, each demo-able on its own.

1. **M1 — Theme engine + live Storybook.** Seed → tokens with contrast solver, `applyTheme`, Storybook addon, 4–6 reference themes, theme-matrix story, public playground page.
2. **M2 — Agent MVP.** Issue labelled `agent:ready` → plan comment → PR → all gates green → computed version bump → patch auto-merge. Write-up of the pipeline.
3. **M3 — Shareable + consumer skills.** Plugin and template repo, consumer skills, `llms.txt`/`install.md`, skill eval, Jira adapter.

**Success metrics**

| Metric | Target |
| --- | --- |
| Reference themes passing all contrast pairs | 100% |
| Agent PRs merged without human code edits | Track; aim > 70% for patch/minor |
| Wrong version bumps after release | 0 |
| Off-system styling in consumer-skill eval (hardcoded colours/px per page) | Down to 0 with skills vs baseline without |
| Time from `agent:ready` to merged patch | Track median |

**Open questions**

- [x] Which pieces of the current VPS setup carry over as-is, and which get rebuilt? leave for now
- [x] Pixel threshold for treating a visual change as breaking? leave for now
- [x] Tailwind v4 `@theme` or plain CSS variables? **Decided: hybrid.** Plain semantic CSS variables are the source of truth; a static `@theme inline` file maps them to Tailwind utilities (see Theme engine).
- [x] Which 4–6 reference themes best show range (e.g. editorial, brutalist, soft consumer, dense dashboard)? i don't mind
- [x] Name for the project? - machine-ui
