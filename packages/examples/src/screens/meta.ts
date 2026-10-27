/** What the docs need to list a screen without loading it. */
export interface ScreenMeta {
  slug: string;
  name: string;
  description: string;
  /** Components the screen is built from, for the "built only from the kit" callout. */
  uses: string[];
}

export const SCREEN_META: ScreenMeta[] = [
  {
    slug: 'coding-agent',
    name: 'Coding agent',
    description: 'A coding agent’s run: sessions, the plan it followed, tool calls, a push that waits for approval, and the diff, checks and terminal beside it. Try approving the push or sending a message.',
    uses: ['sidebar', 'search-input', 'status-dot', 'message', 'thinking-steps', 'tool-call', 'approval-card', 'code-block', 'tabs', 'streaming-text', 'prompt-input', 'select', 'dropdown-menu'],
  },
  {
    slug: 'dashboard',
    name: 'Store dashboard',
    description: 'An analytics overview: stats, area and bar charts, a sortable orders table and system status.',
    uses: ['sidebar', 'breadcrumb', 'toggle-group', 'stat', 'chart', 'data-table', 'badge', 'status-dot', 'card'],
  },
  {
    slug: 'settings',
    name: 'Workspace settings',
    description: 'Workspace settings in tabs for profile, notifications, billing, and team. Deleting the workspace asks you to confirm first.',
    uses: ['tabs', 'field', 'input', 'textarea', 'native-select', 'select', 'copy-input', 'item', 'switch', 'progress', 'avatar', 'alert-dialog'],
  },
];
