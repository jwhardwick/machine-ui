import type { ComponentType } from 'react';
import { ChatScreen } from './chat.tsx';
import { DashboardScreen } from './dashboard.tsx';
import { SettingsScreen } from './settings.tsx';

export interface ScreenDoc {
  slug: string;
  name: string;
  description: string;
  Component: ComponentType;
  /** Components the screen is built from, for the "built only from the kit" callout. */
  uses: string[];
}

export const SCREENS: ScreenDoc[] = [
  {
    slug: 'chat',
    name: 'Agent inbox',
    description: 'A support lead’s inbox, with an AI agent that answers from sources and tool calls. Try sending it a message.',
    Component: ChatScreen,
    uses: ['sidebar', 'search-input', 'message', 'thinking-steps', 'tool-call', 'citation', 'confidence-bar', 'streaming-text', 'prompt-input', 'select', 'dropdown-menu'],
  },
  {
    slug: 'dashboard',
    name: 'Store dashboard',
    description: 'A store’s analytics page with stats, area and bar charts, a sortable orders table, and system status.',
    Component: DashboardScreen,
    uses: ['sidebar', 'breadcrumb', 'toggle-group', 'stat', 'chart', 'data-table', 'badge', 'status-dot', 'card'],
  },
  {
    slug: 'settings',
    name: 'Workspace settings',
    description: 'Workspace settings in tabs for profile, notifications, billing, and team. Deleting the workspace asks you to confirm first.',
    Component: SettingsScreen,
    uses: ['tabs', 'field', 'input', 'textarea', 'native-select', 'select', 'copy-input', 'item', 'switch', 'progress', 'avatar', 'alert-dialog'],
  },
];

export { ChatScreen, DashboardScreen, SettingsScreen };
