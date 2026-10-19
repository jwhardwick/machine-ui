# M1b: Full kit, AI elements, screens and docs site

Implements decision 0002 on top of the finished M1 engine. Same rules as `CLAUDE.md`: tokens only in
`packages/ui`, `pnpm check` green before done.

## Tasks

- [ ] **A. Engine + presets.** Add roles success/-foreground, warning/-foreground, chart-1..5, sidebar/-foreground with solved pairs. Replace presets with graphite (default), harbor, folio, console, bloom, forge and new type pairs (geist, civic, editorial, technical, humanist, heavy). No cream backgrounds: light surfaces near-white for every neutral temperature. Tests: sweep + every preset passes; regenerate CSS.
- [ ] **B. Examples package.** `packages/examples` with `ComponentDoc { slug, name, category, description, examples: { name, render, code? }[] }` and a registry. Storybook stories render examples; site gallery reads the registry.
- [ ] **C. Forms and inputs.** button-group, calendar, checkbox (+indeterminate), combobox, date-picker, field, input-group, input-otp, kbd, native-select, radio-group, select, slider, textarea, toggle, toggle-group, copy-input, search-input.
- [ ] **D. Overlays.** alert-dialog, command, context-menu, drawer, dropdown-menu, hover-card, popover, sheet, sonner (toast), tooltip.
- [ ] **E. Navigation + layout.** accordion, aspect-ratio, breadcrumb, carousel, collapsible, menubar, navigation-menu, pagination, resizable, scroll-area, sidebar, stepper.
- [ ] **F. Data display + feedback.** avatar, chart, data-table, empty, item, progress, skeleton, spinner, table, typography, stat, status-dot.
- [ ] **G. AI elements.** agent-glyph, thinking-indicator, thinking-steps, streaming-text, message, prompt-input, citation, confidence-bar, tool-call, approval-card, code-block.
- [ ] **H. Screens.** Agent chat, analytics dashboard, settings — built only from the kit.
- [ ] **I. Docs site.** Sidebar, home with live theme specimens, components gallery + detail pages, screens, theme generator, floating theme toolbar, install prompt. Visual self-critique with screenshots across presets and modes.
- [ ] **J. Wrap-up.** Changeset, `pnpm check`, tick tasks.
