/** @jsxRuntime classic */
// Storybook's manager bundler compiles JSX to React.createElement without injecting React.
import * as React from 'react';
import { AddonPanel } from 'storybook/internal/components';
import { addons, types } from 'storybook/manager-api';
import { ADDON_ID, PANEL_ID } from './addon/constants.ts';
import { ThemePanel } from './addon/panel.tsx';

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Theme',
    render: ({ active }) => (
      <AddonPanel active={Boolean(active)}>
        <ThemePanel />
      </AddonPanel>
    ),
  });
});
