---
name: ds-component
description: Add or change a component in packages/ui by wrapping a shadcn/Radix primitive, styled with tokens only, with the variant API, examples and stories the system expects. Use for any component work.
---

# Build a component

1. **Start from the primitive.** Use Radix from the `radix-ui` package (`import { Dialog as DialogPrimitive } from 'radix-ui'`) or an established library shadcn uses. Never rebuild behaviour Radix already provides.
2. **One file per component** in `packages/ui/src/components/<name>.tsx`. Parts are named exports (`Dialog`, `DialogContent`, ...). React 19: `ref` is a normal prop, no `forwardRef`. Every rendered element gets `data-slot="<part>"`.
3. **Variants with `cva`**, defaults set in `defaultVariants`, props typed with `VariantProps`. Support `asChild` (via `Slot.Root`) on anything that renders a single interactive element.
4. **Tokens only.** Colours via semantic utilities (`bg-primary`, `text-muted-foreground`, `border-input`); sizes via the spacing scale or `h-(--control-md)`; radii `rounded-md`; motion `duration-(--motion-fast) ease-standard`. Shared fragments live in `src/lib/styles.ts` (`focusRing`, `fieldChrome`, `floatingSurface`, `menuItem`). The `machine-ui/tokens-only` lint rule rejects raw colours, px, palette classes, gradients and font names, and inline disables are switched off.
5. **Export it** from `packages/ui/src/index.ts`.
6. **Document it**: add `packages/examples/src/components/<slug>.tsx` with `defineDoc` (one or more examples, plain-language description). Stories are generated from it.
7. **Interaction tests**: for anything interactive, add a play function in `apps/storybook/src/stories/*Interactions.stories.tsx` covering mouse, keyboard and focus return.

## Verify

```sh
pnpm api:report          # the public API changed: regenerate the report
pnpm lint
pnpm test                # includes "every exported component is documented"
pnpm test:storybook      # renders every example under axe, runs play functions
```
