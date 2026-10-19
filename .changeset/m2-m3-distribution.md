---
"@machine-ui/ui": minor
"@machine-ui/mcp": minor
---

Install machine-ui into any shadcn project from its registry (`npx shadcn add @machine-ui/<item>`), with theme presets as registry items and `llms.txt`, `llms-full.txt` and `install.md` for coding agents. Adds `useReducedMotion()` (charts now respect reduced motion), `MenubarRadioItem` and `MenubarLabel`, and an MCP server (`@machine-ui/mcp`) with `list_components`, `get_component`, `get_tokens` and `generate_theme`. Fixes command lists scrolling the page, lost focus after closing the command palette, data table pagination with a filter, nested sidebars all answering Ctrl/⌘+B, and stat values overflowing narrow cards.
