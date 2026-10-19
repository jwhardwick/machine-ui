# 0002: Expand M1 to a full kit, AI elements, screens and a docs site

Date: 2026-10-19 · Status: accepted (decided by the maintainer)

## Context

The first M1 build shipped the theme engine, 11 components, Storybook and a single playground page.
Review against https://ui.halaska.com/ found it under-built and unattractive: Halaska ships 77
components, complete example screens and a polished docs site. The spec listed "a large AI-pattern
catalogue" as a non-goal and positioned the project against Halaska on theming and maintenance.

## Decision

The maintainer chose to match Halaska's breadth while keeping our theming lead:

1. **Components:** full shadcn/ui parity, plus a set of AI elements, plus complete example screens.
2. **Public surface:** a docs site with sidebar navigation, a component gallery with framed live
   previews, a page per component, example screens, the theme generator, and a floating toolbar that
   re-themes the whole site. Storybook stays as the test and development target.
3. **Look:** keep several strong-personality presets as the headline, redesigned so each looks good.
   The old ledger (cream + serif + rust) and concrete (brutalist) presets are dropped as cliché.

This supersedes the spec's AI-pattern non-goal. The positioning line still holds: Halaska makes a
prototype look designed; machine-ui makes it look like yours.

## Defaults chosen

| Question | Default |
| --- | --- |
| Library majors | Last majors shadcn is known to support: react-day-picker 9, @tanstack/react-table 8, react-resizable-panels 2, recharts 2, react-router 7. |
| Where examples live | `@machine-ui/examples`: one module per component with metadata and example renders, shared by the docs site and Storybook. |
| New colour roles | success, warning, five chart colours and a sidebar surface, all solved for contrast like the rest. |
| Interaction tests | Every interactive component gets a Storybook play function; static ones get a render + axe story per variant. |
