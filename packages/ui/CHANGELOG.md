# @machine-ui/ui

## 0.1.0

### Minor Changes

- 2aa055f: First release. A seed (hue, chroma, neutrals, radius, density, separation, type pairing, type scale, motion) expands into light and dark tokens with every colour pair solved for WCAG 2.2 contrast, including status, chart, sidebar and link colours. `applyTheme` writes them as CSS variables at runtime, `exportTheme` emits CSS, JSON and an agent brief, and seeds serialise to share links. Ships six presets, with console (olive on warm greys, technical type) as the default, plus graphite, harbor, folio, bloom and forge, and a full shadcn/ui-parity component set plus AI elements (prompt input, messages, thinking steps, streaming text, citations, tool calls, approval cards and more), all styled with tokens only.
- bb9e3d5: Install machine-ui into any shadcn project from its registry (`npx shadcn add @machine-ui/<item>`), with theme presets as registry items and `llms.txt`, `llms-full.txt` and `install.md` for coding agents. Adds `useReducedMotion()` (charts now respect reduced motion), `MenubarRadioItem` and `MenubarLabel`, and an MCP server (`@machine-ui/mcp`) with `list_components`, `get_component`, `get_tokens` and `generate_theme`. Fixes command lists scrolling the page, lost focus after closing the command palette, data table pagination with a filter, nested sidebars all answering Ctrl/⌘+B, and stat values overflowing narrow cards.

### Patch Changes

- 6dcf5d5: Sidebar and StreamingText no longer cause a hydration mismatch. On a phone-sized screen the Sidebar's first client render used to differ from the server HTML (a sheet instead of a panel), and StreamingText did the same for visitors who prefer reduced motion. React then re-rendered the whole page on the client, which in Next.js dropped attributes set before hydration, such as a site's theme on `<html>`. Both now render the server's version first and switch once hydrated.
- bcbee6a: `SidebarInset` renders a plain region instead of a second `<main>` when it sits inside another sidebar layout, so pages that embed sidebar demos keep a single main landmark.
- fcf5fad: Components that use hooks, context or Radix now start with `'use client'`, so they work in React Server Components projects such as the Next.js App Router.
- Updated dependencies [2aa055f]
  - @machine-ui/tokens@0.1.0
