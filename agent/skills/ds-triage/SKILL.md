---
name: ds-triage
description: Turn an `agent:ready` issue into a plan comment (scope, files, accessibility, expected version bump, open questions) before any code is written. Use at the start of every issue.
---

# Triage an issue into a plan

1. Read the issue and its acceptance criteria. If there are no acceptance criteria, stop: label the issue `needs-human` and comment asking for them.
2. Read `docs/SPEC.md`, `CLAUDE.md` and any decision in `docs/decisions/` that touches the area.
3. Find the files involved: the component in `packages/ui/src/components/`, its example in `packages/examples/src/components/`, its stories in `apps/storybook/src/stories/`, and engine or token code if colours or sizes change.
4. Predict the version bump with the spec's table, but treat it as a guess: the tool decides (`ds-release`).
5. Post one plan comment in this shape and nothing else:

```markdown
**Plan**
- Scope: <what changes, in one or two sentences>
- Files: <paths>
- Accessibility: <keyboard, focus, labelling, contrast, reduced motion>
- Expected bump: <patch | minor | major> because <reason>
- Open questions: <none, or numbered questions>
```

6. Wait `planWaitHours` (from `agent/config.yaml`). Any maintainer objection pauses the run; silence means proceed.

## Verify

- The comment has all five fields and every acceptance criterion maps to something in Scope.
- `gh issue view <number> --comments` shows the posted plan.
