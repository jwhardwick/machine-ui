---
name: ds-performance
description: Keep components tree-shakeable and within bundle budgets, with no runtime CSS-in-JS or avoidable re-renders. Use when adding dependencies or heavy components.
---

# Performance

- **Tree-shaking:** named exports only, no side effects at module top level, no barrel re-exports that pull in unrelated heavy code. `import { Button } from '@machine-ui/ui'` must not pull in charts or calendars.
- **No runtime CSS-in-JS.** Styling is Tailwind classes resolving to CSS variables; theme changes are variable writes, not re-renders.
- **Dependencies:** prefer what shadcn already uses. A new dependency needs a reason in the PR and a size budget.
- **Compound components:** keep context values stable (`useMemo`) so parts don't all re-render on every change.
- **Budgets** live in `.size-limit.json`. Add an entry for any new heavy component, set about 15% above its measured size.

## Verify

```sh
pnpm size
```
