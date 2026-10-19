import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@machine-ui/ui';
import { expect } from 'storybook/test';

const meta = {
  title: 'Components/Label',
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="label-demo">Email address</Label>
      <input id="label-demo" className="h-(--control-md) rounded-md border border-input bg-background px-3" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Email address')).toBeInTheDocument();
  },
};
