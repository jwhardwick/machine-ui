# machine-ui

A theming-first design system on shadcn/ui, maintained by an autonomous agent. The full spec is in `docs/SPEC.md`. Read it before starting any task.

**Current milestone: M1, theme engine + live Storybook.** Do not start M2 or M3 work unless asked.

## Stack

- pnpm workspaces monorepo, TypeScript (strict), React 19
- shadcn/ui + Radix primitives, Tailwind v4
- Storybook (React + Vite), Vitest, Playwright
- Changesets for versioning

## Layout

```
packages/tokens        token schema, default themes, CSS variable output
packages/theme-engine  palette + type generation, contrast solver, applyTheme (framework-agnostic, no React)
packages/ui            wrapped shadcn components, tokens only
apps/storybook         docs, live theme editor addon, visual test target
apps/site              public playground (M1 end)
agent/                 skills, subagents, hooks, workflows (M2+)
docs/                  SPEC.md, plans/, decisions/
```

Package scope is `@machine-ui/*` (the spec's `@ds/*` is a placeholder).

## Commands

Set these up in the first task, then keep them working:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm storybook`
- `pnpm test:storybook` (interaction + axe)
- `pnpm check` (runs all of the above; must pass before saying a task is done)

## Hard rules

- **Tokens only in `packages/ui`.** No raw colours, px values or font names. Use CSS variables from `@machine-ui/tokens`. A lint rule enforces this; never disable it.
- **Theme output is hybrid.** The engine writes plain semantic CSS variables (`--primary`, `--radius`). A static `@theme inline` file maps them to Tailwind utilities. Never put literal values inside `@theme inline`.
- **Generate colour in OKLCH. Solve for contrast, don't check after.** WCAG 2.2: 4.5:1 body text, 3:1 large text and UI boundaries. Every reference theme must pass in light and dark.
- **`theme-engine` has no React or DOM dependencies** except inside `applyTheme`.
- **No default theme uses Inter, purple-to-blue gradients or maximum radius.**
- **Never push to `main`.** Work on a branch, open a PR.
- **Run `pnpm check` before declaring done.** If a gate fails, fix the cause, not the gate.
- **Ambiguity:** if the spec doesn't answer something, write the question and your chosen default in `docs/decisions/` and carry on. Stop and ask only if the choice is hard to reverse.

## Working style

- One task from `docs/plans/m1.md` at a time. Tick it off in that file when done.
- Small commits with clear messages. Add a changeset for any user-facing change.
- New components: one story per variant and state, with a play function for interactive ones.
