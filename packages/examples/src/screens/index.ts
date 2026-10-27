import type { ComponentType } from 'react';
import { CodingAgentScreen } from './coding-agent.tsx';
import { DashboardScreen } from './dashboard.tsx';
import { SettingsScreen } from './settings.tsx';
import { SCREEN_META, type ScreenMeta } from './meta.ts';

export interface ScreenDoc extends ScreenMeta {
  Component: ComponentType;
}

const COMPONENTS: Record<string, ComponentType> = { 'coding-agent': CodingAgentScreen, dashboard: DashboardScreen, settings: SettingsScreen };

export const SCREENS: ScreenDoc[] = SCREEN_META.map((meta) => ({ ...meta, Component: COMPONENTS[meta.slug]! }));

export { CodingAgentScreen, DashboardScreen, SettingsScreen };
