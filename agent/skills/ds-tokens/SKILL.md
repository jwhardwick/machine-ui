---
name: ds-tokens
description: Add, rename or remove design tokens and map them through the theme engine without breaking consumers. Use for any change to colour roles, sizes, type, motion or presets.
---

# Change tokens

1. **Names live in `packages/tokens/src/schema.ts`** (`COLOR_ROLES`, `SHARED_TOKENS`, `MODE_TOKENS`). Every name is mapped to Tailwind in `packages/tokens/theme.css` (`@theme inline`, values must be `var(--…)` only).
2. **Values come from the engine** (`packages/theme-engine/src`): colour roles in `palette.ts`, sizes in `shape.ts`, type in `typography.ts`, motion in `motion.ts`.
3. **New colour role:** add it to `COLOR_ROLES`, generate it in both modes in `palette.ts`, and add every pair it will be used in to `CONTRAST_PAIRS` (4.5:1 text, 3:1 boundaries). The engine solves those pairs; never hand-pick values.
4. **Renames ship as minor with an alias:** keep the old name generating the same value, mark it deprecated in a comment and a dev-time console warning, and open an issue to remove it in the next major.
5. **Removing a token is major.** Prefer the deprecation path.
6. Regenerate outputs: `pnpm --filter @machine-ui/theme-engine build:css` and `pnpm api:report`.

## Verify

```sh
pnpm test            # contrast sweep and fuzz tests, theme.css checks, report drift
pnpm release:bump    # removal/rename shows up as major, additions as minor
```
