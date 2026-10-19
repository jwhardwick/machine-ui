---
name: ds-docs
description: Document a component with examples, stories, interaction tests and usage notes. Use whenever a component is added or its API changes.
---

# Document a component

1. **Example module** `packages/examples/src/components/<slug>.tsx`: `defineDoc({ slug, name, category, description, examples })`. The description says what it is and when to use it, in plain words. Use realistic content (names, numbers, product copy), never lorem ipsum.
2. **One example per meaningful variant or state.** Stories are generated from these (`apps/storybook/src/generated`), each rendered under axe.
3. **Interaction tests** for interactive behaviour in `apps/storybook/src/stories/*Interactions.stories.tsx`, using `example('<slug>', '<example name>')` so tests exercise exactly what the docs show.
4. The docs site, `llms.txt` and the registry are generated from the same source; never edit generated files.

## Verify

```sh
pnpm docs:build       # regenerate llms.txt, llms-full.txt and install.md
pnpm test             # registry renders every example; every export is documented
pnpm test:storybook
```
