---
name: use-ds-compose
description: Compose pages from machine-ui components — layouts, forms, data display, overlays and agent UIs — choosing the right component for each job. Use when building any screen with machine-ui.
---

# Compose with machine-ui

Read `<host>/llms.txt` for the full component list. Install what you need with `npx shadcn@latest add @machine-ui/<item>`.

## Which component for which job

| Job | Use | Not |
| --- | --- | --- |
| App navigation | `sidebar` (collapses to icons; sheet on mobile) | a hand-made `<nav>` column |
| Site navigation | `navigation-menu`, `breadcrumb` | |
| Primary action | `button` (one `default` per view; others `outline`, `ghost`) | links styled as buttons |
| Form field | `field` + `input`/`textarea`/`select`/`native-select`/`combobox` | bare inputs with ad-hoc labels |
| Yes/no setting | `switch` (applies now) or `checkbox` (applies on save) | |
| One of a few | `radio-group` or `toggle-group` | |
| Date | `date-picker` | text input with a format hint |
| Confirm a destructive action | `alert-dialog` | `dialog` |
| Side panel | `sheet`; mobile bottom sheet: `drawer` | |
| Actions on an item | `dropdown-menu`; right click: `context-menu` | |
| Search actions | `command` (its `CommandDialog` is the ⌘K palette) | |
| Tabular data | `data-table` (sort, filter, select, paginate); simple: `table` | grids of divs |
| Metrics | `stat` in `card`; trends: `chart` | |
| Status | `badge`, `status-dot` with text | colour alone |
| Empty view | `empty` with one action | blank space |
| Feedback | `alert` inline; `sonner` toasts for transient results | |
| Loading | `skeleton` for known layout, `spinner` otherwise | |
| Agent chat | `message`, `prompt-input`, `thinking` (`ThinkingSteps`, `ThinkingIndicator`), `tool-call`, `citation`, `streaming-text`, `approval-card` | |

## Page patterns

- **App shell:** `SidebarProvider` → `Sidebar` (header, groups, footer) + `SidebarInset` with a header bar (`SidebarTrigger`, title, actions) and scrolling content.
- **Settings:** `tabs` across sections; each section a `card` of `field`s with one save action in the footer; destructive actions last, behind `alert-dialog`.
- **Dashboard:** a row of `stat` cards, then `chart` cards, then a `data-table`.
- **Agent chat:** sidebar of threads; conversation of `message`s; `prompt-input` docked at the bottom with `prompt-suggestions` above it.
- **Coding agent:** sidebar of sessions with a `status-dot` each; the run as `message`s with `thinking-steps`, `tool-call`s and an `approval-card` before anything leaves the machine; a side panel of `tabs` (changes, checks, terminal) using `code-block`.

## Rules

- Style only with semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`, `text-link`); no raw colours, px values, gradients or font names.
- Spacing from the scale (`gap-4`, `p-6`); control heights `h-(--control-md)`.
- Every icon-only button has an `aria-label`; every input has a label.

## Verify

```sh
npx tsc --noEmit
npm run build
```

Then search the new code for `#`, `rgb(`, `px` and font names: there should be none.
