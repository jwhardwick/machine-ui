# @machine-ui/figma

Pushes machine-ui's tokens and components into Figma. See `docs/decisions/0005-figma-bridge.md`
for how it's designed.

## Run it

```sh
pnpm figma            # extract components from Chromium, then build the plugin
pnpm figma:build      # rebuild the plugin only (tokens change, no component change)
```

Then, in the Figma desktop app:

1. Open (or create) the file you want the library in.
2. **Plugins → Development → Import plugin from manifest…** and pick `tooling/figma/plugin/manifest.json`. You only do this once.
3. **Plugins → Development → machine-ui bridge → Sync everything.**

You get:

- **Variables.** `machine-ui/Theme` has one mode per reference theme. `machine-ui/Color` has Light and Dark modes. To re-theme a frame, set both modes on it in the right panel's Layer section.
- **A Components page** with one component set per spec in `apps/storybook/figma/specs.tsx`. Fills, strokes, corners, padding, gaps, font sizes and typefaces are bound to Variables.

Re-run **Sync everything** after `pnpm figma` whenever code changes. Components update in place.

## Add a component

Add an entry to `FIGMA_SPECS` in `apps/storybook/figma/specs.tsx` with its variant axes and a
render function, then run `pnpm figma`.

## Limits

- Grid layouts that aren't one row or column come in absolutely positioned (Alert, for now).
- Mixed-style text (a bold word in a sentence) comes in as one style.
- Shadows are literal, not bound.
- Hover and focus states aren't extracted; add them as a `state` axis if you need them.
