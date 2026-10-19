import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Switch } from '@machine-ui/ui';
import { expect, fn, userEvent } from 'storybook/test';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { onCheckedChange: fn() },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="notify" {...args} />
      <Label htmlFor="notify">Email notifications</Label>
    </div>
  ),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas }) => {
    const toggle = canvas.getByRole('switch', { name: 'Email notifications' });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard(' ');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
  },
};

export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
