# 0004: The site URL in generated docs

Date: 2026-10-26 · Status: accepted

## Context

`install.md` is generated at build time and committed, so it can't read the browser's origin the way
the site's Get started page does. It used `https://example.com` with a note to substitute the real
host. Agents and people copying the `registries` snippet got a host that doesn't exist. The spec
doesn't say where the site lives.

## Decision

`tooling/registry/src/docs.ts` exports `SITE_URL`, defaulting to
`https://machine-ui.factory.jwhardwick.dev`, and `install.md` uses it for the registry URL.

| Question | Default | Why |
| --- | --- | --- |
| Hardcode or configure? | A default in source, overridable with the `SITE_URL` environment variable. | The committed file must match one URL for the drift test; another team deploying a fork sets `SITE_URL` for `pnpm docs:build` and `pnpm test`. |
| Absolute URLs in `llms.txt` too? | No, it keeps relative links. | They resolve against whichever host serves the file, so they're already correct. |
