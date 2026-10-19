---
"@machine-ui/ui": patch
---

Components that use hooks, context or Radix now start with `'use client'`, so they work in React Server Components projects such as the Next.js App Router.
