# machine-ui maintainer agent

A Claude Code plugin that maintains a shadcn-based design system from an issue board. It turns an
issue labelled `agent:ready` into a plan comment, an implementation on a branch and a PR that must
pass the same deterministic gates as any human change.

## What's in it

| Path | Purpose |
| --- | --- |
| `skills/` | `ds-triage`, `ds-component`, `ds-a11y`, `ds-tokens`, `ds-performance`, `ds-docs`, `ds-release`. Each ends with a verification step. |
| `agents/` | `ds-triager` (read-only planner), `ds-implementer`, `ds-reviewer` (read-only). |
| `hooks/` | The trust boundary, enforced: no pushes to main or force pushes, no publishing, no merging, no skipping hooks, no edits to CI, generated reports, visual baselines, release config, lint config or `agent/config.yaml`. Lint runs after every edit to component code. |
| `config.yaml` | This repository's settings: autonomy per bump level, labels, retries, gates. |
| `config.template.yaml` | Starting point for another team: everything review-required. |

## The loop

```
agent:ready → plan comment → (wait planWaitHours) → implement on a branch → PR → gates
  gates fail → fix and retry, up to `retries` times → otherwise label needs-human
  gates pass → computed bump → patch: per autonomy.patch; minor: per autonomy.minor; major: approval
```

## Use it

```sh
claude --plugin-dir ./agent
```

The always-on runner (webhooks or polling on a server) and the Jira adapter are not part of this
release; see `docs/decisions/0003-m2-m3-scope.md`.
