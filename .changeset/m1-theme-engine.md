---
"@machine-ui/tokens": minor
"@machine-ui/theme-engine": minor
"@machine-ui/ui": minor
---

First release of the theme engine and token system. A seed (hue, chroma, neutrals, radius, density, separation, type pairing, type scale, motion) expands into light and dark tokens with every colour pair solved for WCAG 2.2 contrast. `applyTheme` writes them as CSS variables at runtime, `exportTheme` emits CSS, JSON and an agent brief, and seeds serialise to share links. Ships five reference themes and eleven token-only components: Button, Badge, Card, Alert, Separator, Label, Input, Checkbox, Switch, Tabs and Dialog.
