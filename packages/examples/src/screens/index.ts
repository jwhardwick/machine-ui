import type { ComponentType } from 'react';
import { ChatScreen } from './chat.tsx';
import { DashboardScreen } from './dashboard.tsx';
import { SettingsScreen } from './settings.tsx';
import { SCREEN_META, type ScreenMeta } from './meta.ts';

export interface ScreenDoc extends ScreenMeta {
  Component: ComponentType;
}

const COMPONENTS: Record<string, ComponentType> = { chat: ChatScreen, dashboard: DashboardScreen, settings: SettingsScreen };

export const SCREENS: ScreenDoc[] = SCREEN_META.map((meta) => ({ ...meta, Component: COMPONENTS[meta.slug]! }));

export { ChatScreen, DashboardScreen, SettingsScreen };
