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
    slug: 'chat',
    name: 'Agent inbox',
    description: 'A support agent’s workspace: threads, a worked answer with sources and tools, and a live composer. Try sending a message.',
    uses: ['sidebar', 'search-input', 'message', 'thinking-steps', 'tool-call', 'citation', 'confidence-bar', 'streaming-text', 'prompt-input', 'select', 'dropdown-menu'],
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
    description: 'Tabbed settings: a profile form, notification switches, billing usage, a team list and a confirmed delete.',
    uses: ['tabs', 'field', 'input', 'textarea', 'native-select', 'select', 'copy-input', 'item', 'switch', 'progress', 'avatar', 'alert-dialog'],
  },
];
