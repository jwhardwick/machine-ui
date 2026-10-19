import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertDescription, AlertTitle } from '@machine-ui/ui';
import { expect } from 'storybook/test';

const meta = {
  title: 'Components/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-md">
      <AlertTitle>Theme saved</AlertTitle>
      <AlertDescription>Share the link to let others preview it.</AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Theme saved');
  },
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-md">
      <AlertTitle>Deploy failed</AlertTitle>
      <AlertDescription>The contrast gate rejected two colour pairs.</AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Deploy failed');
  },
};
