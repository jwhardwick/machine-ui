# Install machine-ui

machine-ui installs as source through the [shadcn CLI](https://ui.shadcn.com/docs/cli). You need a React project with Tailwind CSS v4.

The registry is at `https://machine-ui.factory.jwhardwick.dev/r/{name}.json`. If you are reading a copy of this file on another host, use that host's `/r/{name}.json` instead.

## 1. Add the registry

Run `npx shadcn@latest init` if the project has no `components.json`, then add:

```json
"registries": { "@machine-ui": "https://machine-ui.factory.jwhardwick.dev/r/{name}.json" }
```

## 2. Install a theme

A theme brings the token mapping, base styles and animations with it. The default is console; see `/llms.txt` for the others, or generate one at `/themes`.

```sh
npx shadcn@latest add @machine-ui/theme-console
```

Dark mode follows a `dark` class on an ancestor (usually `<html>`).

## 3. Load the fonts

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" />
```

## 4. Add components

```sh
npx shadcn@latest add @machine-ui/button @machine-ui/card @machine-ui/sidebar
```

Each component page and `/llms.txt` list the exact items. Installed files are yours to edit.

## 5. Verify

Run the project's typecheck, lint and build. Search new code for raw colours (`#`, `rgb(`), `px` values and font names: there should be none.
