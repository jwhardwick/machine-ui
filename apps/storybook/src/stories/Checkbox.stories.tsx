import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Label } from '@machine-ui/ui';
import { expect, fn, userEvent } from 'storybook/test';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { onCheckedChange: fn() },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms">Accept terms</Label>
    </div>
  ),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas }) => {
    const box = canvas.getByRole('checkbox', { name: 'Accept terms' });
    await expect(box).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(box);
    await expect(box).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard(' ');
    await expect(box).toHaveAttribute('aria-checked', 'false');
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
  },
};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('checkbox'), { pointerEventsCheck: 0 });
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};
