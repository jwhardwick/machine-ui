---
name: use-ds-theme
description: Turn a written brief ("calm, editorial, warm") into a machine-ui theme seed, export it and apply it. Use when someone wants the product to look like theirs rather than a preset.
---

# Make a theme from a brief

A theme is a seed of ten settings. The engine expands it into every colour, size and curve and solves each colour pair for contrast, so you only choose personality, never colours.

## Map the brief to a seed

| Setting | Range | Brief words → value |
| --- | --- | --- |
| `hue` | 0–360 | the brand colour: red 25, orange 55, yellow 95, green 150, teal 195, blue 250, violet 285, pink 350 |
| `chroma` | 0–1 | muted, quiet, serious → 0.1–0.3; balanced → 0.4–0.6; vivid, playful, bold → 0.7–1. Below 0.2 the primary becomes ink. |
| `neutral` | cool, neutral, warm | technical, clinical → cool; editorial, plain → neutral; friendly, homely → warm |
| `radius` | 0–1 | sharp, precise → 0–0.15; balanced → 0.3–0.5; soft, friendly → 0.7–0.9 (never pills) |
| `density` | 0–1 | dashboards, data → 0–0.3; apps → 0.4–0.6; marketing, reading → 0.7–1 |
| `separation` | 0–1 | flat, bordered, editorial → 0–0.3; lifted, layered → 0.6–1 |
| `typePair` | geist, civic, editorial, technical, humanist, heavy | neutral product → geist; public service → civic; editorial → editorial; developer → technical; friendly → humanist; loud → heavy |
| `typeRatio` | 1.125–1.333 | dense UI → 1.125; general → 1.2; expressive headings → 1.333 |
| `motion` | none, subtle, expressive | serious, accessible-first → none or subtle; playful → expressive |

Write the seed as JSON with a short `name`, and explain each choice in one line.

## Export and apply

1. Open `<host>/themes`, enter the seed (or use the MCP tool `generate_theme` if available) and export `theme.css`. Share link format: `<host>/?theme=<encoded seed>`.
2. If the project uses a preset already, replace that preset's `:root` and `.dark` blocks in the global stylesheet with the exported CSS. Otherwise install `@machine-ui/machine-ui-base` first, then paste the CSS.
3. Load the type pair's fonts (`<host>/install.md` shows the pattern).
4. Save the exported `theme-brief.md` in the repo (for example `docs/theme-brief.md`) so future agents follow the theme's do and don't rules.

## Verify

```sh
npm run build
```

Then check a page in light and dark: the contrast table on `<host>/themes` must show every pair passing for the seed.
