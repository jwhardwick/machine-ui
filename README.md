# machine-ui

A theming-first design system on [shadcn/ui](https://ui.shadcn.com) and Radix, maintained by an
autonomous agent.

**Docs, theme playground and registry: [machine-ui.factory.jwhardwick.dev](https://machine-ui.factory.jwhardwick.dev)**

Other kits make a prototype look designed; this makes it look like yours, and keeps itself healthy.

- **Generated themes.** A small seed (brand hue, neutral temperature, radius, density, separation,
  type pairing, scale ratio, motion) expands into a full token set in OKLCH, light and dark.
- **Contrast solved, not checked.** Every colour pair is solved for WCAG 2.2: 4.5:1 for body text,
  3:1 for large text and UI boundaries.
- **Runtime theming.** `applyTheme(seed)` writes plain CSS variables. No rebuild, no Tailwind
  recompile. Seeds serialise to a URL so themes are shareable links.
- **Source you own.** Components install through the shadcn CLI and use tokens only.
- **Agent-ready.** `llms.txt`, an MCP server and Claude Code skills help coding agents use the
  system correctly.

## Install

You need a React project with Tailwind CSS v4. Add the registry to `components.json`:

```json
"registries": { "@machine-ui": "https://machine-ui.factory.jwhardwick.dev/r/{name}.json" }
```

Then install a theme and some components:

```sh
npx shadcn@latest add @machine-ui/theme-console
npx shadcn@latest add @machine-ui/button @machine-ui/card @machine-ui/sidebar
```

The full guide, including fonts and dark mode, is at
[/install.md](https://machine-ui.factory.jwhardwick.dev/install.md). To make your own theme, use the
[theme playground](https://machine-ui.factory.jwhardwick.dev/themes).

## For coding agents

- [`llms.txt`](https://machine-ui.factory.jwhardwick.dev/llms.txt) and
  [`llms-full.txt`](https://machine-ui.factory.jwhardwick.dev/llms-full.txt): the rules, every
  component and its props.
- [`packages/mcp`](packages/mcp): an MCP server with `list_components`, `get_component`,
  `get_tokens` and `generate_theme`.
- [`consumer/`](consumer): a Claude Code plugin with install, theme, compose and migrate skills
  (`claude --plugin-dir ./consumer`).

## Repository

| Path | Purpose |
| --- | --- |
| `packages/tokens` | Token schema, default themes, CSS variable output |
| `packages/theme-engine` | Palette and type generation, contrast solver, `applyTheme` (framework-agnostic) |
| `packages/ui` | Wrapped shadcn components, tokens only |
| `packages/examples` | Example screens and component demos used by the site and Storybook |
| `packages/mcp` | MCP server for coding agents |
| `apps/site` | The public site: docs, theme playground, registry, `llms.txt` |
| `apps/storybook` | Component docs, live theme editor, visual test target |
| `agent/` | The [maintainer agent](agent/README.md): skills, subagents, trust-boundary hooks |
| `consumer/` | Claude Code plugin for projects that use machine-ui |
| `tooling/` | Registry, docs, release and eval tooling |
| `docs/` | [Spec](docs/SPEC.md), plans and decision records |

## Development

Requires Node 22 or later and pnpm.

```sh
pnpm install
pnpm storybook      # component docs and the live theme editor
pnpm check          # every gate: typecheck, lint, tests, size, Storybook, visual and site tests
```

Other commands are listed in [`CLAUDE.md`](CLAUDE.md). After a component change run
`pnpm registry:build`; after a public API or token change run `pnpm api:report`. Add a changeset
(`pnpm changeset`) for any user-facing change.

## How it's maintained

Issues labelled `agent:ready` are picked up by the maintainer agent, which posts a plan, implements
it on a branch and opens a PR. The PR has to pass the same deterministic gates as a human change.
The agent can't push to `main`, publish, or change CI. See [`agent/README.md`](agent/README.md) and
[`docs/SPEC.md`](docs/SPEC.md).
