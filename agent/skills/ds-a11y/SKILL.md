---
name: ds-a11y
description: Accessibility rules for design-system components (WAI-ARIA patterns, focus, labelling, contrast, motion). Use whenever a component is added or its behaviour changes.
---

# Accessibility

- **Follow the WAI-ARIA Authoring Practices pattern** for the widget (menu, dialog, tabs, listbox, combobox...). Radix implements most of it; don't override roles or key handling.
- **Keyboard:** every action reachable by keyboard; arrow keys inside composite widgets, Tab between them, Escape closes overlays.
- **Focus:** visible focus everywhere (`focusRing`). Overlays trap focus while open and return it to the opener on close. If an overlay has no trigger (opened from state or a shortcut), return focus explicitly (see `CommandDialog`).
- **Labelling:** every control has an accessible name; icon-only buttons need `aria-label`; decorative icons get `aria-hidden`. The accessible name must contain the visible text.
- **Colour is never the only signal:** pair status colours with text or icons (`ConfidenceBar`, `Stat`, `StatusDot`).
- **Contrast is solved by the theme engine.** Use the semantic pairs it guarantees (a surface with its `-foreground`, `link` for coloured text, `muted-foreground` on background, card or muted). If you need a new pair, add it to `CONTRAST_PAIRS` instead of picking colours.
- **Motion:** CSS motion uses the motion tokens, which drop to 0ms under reduced motion. Motion driven from JavaScript (charts, streamed text) must check `useReducedMotion()`.
- **Scrollable regions** must be keyboard-focusable.

## Verify

```sh
pnpm test:storybook   # axe on every example, interaction tests for keyboard and focus
pnpm test:site        # axe on every site route in several themes, light and dark
```
