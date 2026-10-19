# @machine-ui/mcp

An MCP server that lets any coding agent use machine-ui without scraping the docs.

| Tool | What it returns |
| --- | --- |
| `list_components` | Every component (optionally one category) with a description and its `npx shadcn` install command. |
| `get_component` | One component: install command, props of each part and example code. Suggests close matches for unknown slugs. |
| `get_tokens` | The token contract; with `preset`, that preset's exact light and dark values. |
| `generate_theme` | A contrast-safe theme from any part of a seed: CSS for `:root` and `.dark`, a share string, an agent brief and a contrast audit. |

## Use it

```sh
claude mcp add machine-ui -- node /path/to/machine-ui/packages/mcp/src/bin.ts
```

Requires Node 22.18 or later (it runs TypeScript directly).

The component catalogue in `data/components.json` is generated from the examples by `pnpm docs:build`.
