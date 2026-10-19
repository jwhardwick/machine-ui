# Skill eval

Measures what the consumer skills are for: with them, agent-built pages should contain no off-system
styling (raw colours, px values, palette classes, gradients, font names, numeric inline styles).

- `tasks.json`: five page-building tasks, the same prompt in both modes.
- `src/score.ts`: counts off-system styling with the same patterns as the `tokens-only` lint rule.
- `src/run.ts`: runs each task with `claude -p` in a fresh copy of `template/`, with or without the
  consumer plugin, then scores the pages.

```sh
pnpm eval:run --mode baseline --out /tmp/eval-baseline
pnpm eval:run --mode skills --out /tmp/eval-skills
pnpm eval:run --compare /tmp/eval-baseline/baseline.json /tmp/eval-skills/skills.json
```

Live runs use model credits and the Claude Code CLI; add `--dry-run` to see the exact commands. The
skills mode installs from the registry: run `pnpm --filter @machine-ui/site build && pnpm --filter
@machine-ui/site preview` first (the template's `components.json` points at `localhost:4173`).
