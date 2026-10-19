import type { Meta, StoryObj } from '@storybook/react-vite';
import { REFERENCE_THEMES } from '@machine-ui/tokens';
import { expect, waitFor } from 'storybook/test';
import { ThemeMatrix } from '../theme-matrix.tsx';

const meta = {
  title: 'Theme/Matrix',
  component: ThemeMatrix,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ThemeMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every reference theme, light and dark, side by side. Axe runs across all of them. */
export const ReferenceThemes: Story = {
  play: async ({ canvasElement }) => {
    const cells = [...canvasElement.querySelectorAll<HTMLElement>('[data-theme-cell]')];
    await expect(cells).toHaveLength(REFERENCE_THEMES.length * 2);
    await waitFor(() => {
      const signatures = cells.map((cell) => {
        const style = getComputedStyle(cell);
        return ['--background', '--primary', '--radius', '--typeface-display'].map((v) => style.getPropertyValue(v).trim()).join('|');
      });
      expect(signatures.every((value) => value.startsWith('oklch'))).toBe(true);
      expect(new Set(signatures).size).toBe(cells.length);
    });
    for (const cell of cells) await expect(cell).toHaveAttribute('data-mode');
  },
};
