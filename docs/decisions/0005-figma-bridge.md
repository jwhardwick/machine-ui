# 0005: Figma bridge

Date: 2026-11-27 · Status: accepted

## Context

The maintainer wants to make design changes in Figma. Paid importers (story.to.design) cost too
much for a one-person project, and generic HTML importers produce literal values with no link to
tokens. The theme engine generates and contrast-solves every colour, so a hand-edited hex in Figma
can't flow back into code as it is.

## Decision

Code stays the source of truth. A repo-owned bridge pushes tokens and components into Figma:

- `tooling/figma` builds Figma Variables from the reference themes and bundles a development
  plugin (`plugin/manifest.json`) with that data embedded. It runs on any Figma plan.
- `apps/storybook/figma` renders each spec in `specs.tsx` in Chromium, walks the DOM and writes
  scene JSON. Colours, corners, spacing, type sizes and typefaces are matched back to token names by
  value, so the plugin binds them to Variables instead of writing literals.
- Changes made in Figma come back as code changes: seed edits for colour, component edits for
  layout. Nothing reads Figma automatically yet.

Commands: `pnpm figma:extract` (needs network for web fonts), `pnpm figma:build`, or `pnpm figma`
for both. Neither is part of `pnpm check`.

## Defaults chosen

| Question | Default | Why |
| --- | --- | --- |
| How are themes and modes laid out in Variables? | Two collections. `machine-ui/Theme` has one mode per reference theme and holds raw light and dark colours (hidden from pickers), corners, spacing, type and typefaces. `machine-ui/Color` has Light and Dark modes and aliases each role into Theme. | A frame can switch theme and mode independently, and each collection stays well under Professional's mode limit (6 and 2, rather than 12). |
| Fluid type sizes in Figma? | Evaluated at a 1280px viewport, the width the extractor measures at. | Figma has no `clamp()`. |
| Which theme are literals measured in? | `console`, light. | It's the default seed. Bound properties re-theme anyway; only unmatched values stay literal. |
| What becomes a Figma component? | Only what `specs.tsx` lists, one render per variant combination. | Docs examples show several variants side by side; a Figma variant must be exactly one. |
| Layout that isn't flexbox (grid, block flow)? | Inferred as a stack when children sit in one column or row with a constant gap; otherwise absolutely positioned. | Accurate visually, and editable where the structure allows. |
| Fallback when a font is missing in Figma? | Roboto, with a warning. | It ships with Figma, and default themes must not use Inter. |
| Re-running the plugin? | Updates components in place, matched by plugin data and variant name, and removes variants that no longer exist. | Instances in other files keep their link. Overrides on changed layers may reset. |
| Shadows | Literal effects, not bound. | Figma can't bind a whole shadow list to one variable. |
