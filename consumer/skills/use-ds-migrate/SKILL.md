---
name: use-ds-migrate
description: Move an existing app onto machine-ui screen by screen, replacing hardcoded colours, sizes, fonts and hand-rolled components with tokens and kit components. Use after use-ds-install on an app that already has UI.
---

# Migrate an existing app

Work one screen (or one shared component) at a time, so every step ships and can be reviewed.

1. **Inventory.** List hardcoded styles in the target screen: hex/rgb/hsl colours, `px` sizes, font names, Tailwind palette classes (`bg-gray-100`, `text-blue-600`), shadows and radii.
2. **Map colours to roles** by meaning, not appearance: page → `background`; text → `foreground`; secondary text → `muted-foreground`; panels → `card`; lines → `border`; inputs → `input`; brand actions → `primary`; links → `link`; errors → `destructive`. If the app has its own variables, first alias them to these roles (`--ink: var(--foreground)`) so untouched screens follow the theme too.
3. **Replace hand-rolled components** with kit components (see `use-ds-compose`): buttons, inputs, menus, dialogs, tables, tabs. Install each with `npx shadcn@latest add @machine-ui/<item>`.
4. **Sizes and type:** spacing to the scale (`p-4`, `gap-6`), font sizes to `text-sm`…`text-4xl`, radii to `rounded-sm`…`rounded-xl`, font families to `font-sans`, `font-display`, `font-mono`.
5. **Keep behaviour identical.** Same routes, same data, same labels. Fix accessibility issues the kit components expose (missing labels), but don't redesign flows in a migration.
6. Delete styles and components that are no longer used.

## Verify

```sh
npx tsc --noEmit
npm run lint
npm run build
```

Then compare the migrated screen in light and dark against the original, and search it for `#`, `rgb(`, `px` and palette classes: none should remain.
