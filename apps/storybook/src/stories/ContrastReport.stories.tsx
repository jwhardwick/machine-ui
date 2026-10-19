import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { seedFromGlobals } from '../../.storybook/theme.ts';
import { ContrastReport } from '../contrast-report.tsx';

const meta = {
  title: 'Theme/Contrast report',
  component: ContrastReport,
  render: (_args, { globals }) => <ContrastReport seed={seedFromGlobals(globals)} />,
} satisfies Meta<typeof ContrastReport>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every solved pair for the active theme (change it in the Theme panel). */
export const ActiveTheme: Story = {
  args: { seed: undefined as never },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-pass]').length).toBeGreaterThan(0);
    await expect(canvasElement.querySelectorAll('[data-pass="false"]')).toHaveLength(0);
  },
};
