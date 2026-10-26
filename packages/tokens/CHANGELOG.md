# @machine-ui/tokens

## 0.1.0

### Minor Changes

- 2aa055f: First release. A seed (hue, chroma, neutrals, radius, density, separation, type pairing, type scale, motion) expands into light and dark tokens with every colour pair solved for WCAG 2.2 contrast, including status, chart, sidebar and link colours. `applyTheme` writes them as CSS variables at runtime, `exportTheme` emits CSS, JSON and an agent brief, and seeds serialise to share links. Ships six presets, with console (olive on warm greys, technical type) as the default, plus graphite, harbor, folio, bloom and forge, and a full shadcn/ui-parity component set plus AI elements (prompt input, messages, thinking steps, streaming text, citations, tool calls, approval cards and more), all styled with tokens only.
