---
name: use-ds-install
description: Add the machine-ui design system to a React + Tailwind v4 project through the shadcn CLI (registry, theme, fonts, first components). Use when a project should start using machine-ui.
---

# Install machine-ui

1. **Detect the project.** Read `package.json`: Next.js (`next`), Vite (`vite`) or other React. Confirm Tailwind CSS v4 (`tailwindcss` ^4 and `@import "tailwindcss"` in the global stylesheet). If Tailwind is v3 or missing, stop and tell the person; machine-ui needs v4.
2. **shadcn config.** If there is no `components.json`, run `npx shadcn@latest init`. Check its aliases (`@/components/ui`, `@/lib/utils`, `@/hooks`) resolve in `tsconfig.json` paths.
3. **Registry.** Add `"registries": { "@machine-ui": "<host>/r/{name}.json" }` to `components.json`, where `<host>` serves `llms.txt` and `install.md` (ask if unknown).
4. **Theme.** Install one preset: `npx shadcn@latest add @machine-ui/theme-<name>` (see `<host>/llms.txt` for presets, or `use-ds-theme` for a custom theme). It writes CSS variables and the Tailwind mapping into the global stylesheet.
5. **Dark mode.** machine-ui themes switch on a `dark` class on an ancestor. If the project uses another mechanism (for example `[data-theme="dark"]`), add the `dark` class alongside it in the same place.
6. **Fonts.** Load the preset's typefaces (`install.md` has the link). In Next.js prefer `next/font/google` and point `--typeface-display`, `--typeface-text` and `--typeface-code` at the font variables.
7. **Components.** Install only what the current task needs, for example `npx shadcn@latest add @machine-ui/button @machine-ui/card`. Files land in the project and can be edited.
8. **Existing tokens.** If the project already has its own CSS variables for colour, alias them to machine-ui roles (`--paper: var(--background)`) instead of deleting them, so existing pages keep working while you migrate (`use-ds-migrate`).

## Verify

```sh
npx tsc --noEmit
npm run lint
npm run build
```

Then open a page using an installed component in light and dark and check it is styled (not unstyled HTML).
