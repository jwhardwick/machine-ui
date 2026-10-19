---
name: ds-release
description: Determine the version bump from the API and token diff, and write the changeset and any migration notes. Use before opening every PR.
---

# Release notes

The tool decides the bump; you explain it. Never choose a level yourself.

1. `pnpm api:report` to bring `api/` up to date with your change.
2. `pnpm release:bump --check-changeset` and read the output: `@machine-ui/ui version: minor (2 new exports)` plus one line per change.
3. Add a changeset at exactly that level for each listed package (`pnpm changeset`, or a file in `.changeset/`), written for consumers: what they can now do, or what they must change.
4. **Major:** include a migration note with before and after code for every listed breaking change.
5. Paste the tool's output into the PR description.

## Verify

```sh
pnpm release:bump --check-changeset   # exits 0 only when the changesets cover the computed level
```
