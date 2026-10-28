import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Label } from '@machine-ui/ui';
import { expect, userEvent } from 'storybook/test';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { placeholder: 'you@example.com', type: 'email' },
  render: (args) => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Email');
    await userEvent.type(input, 'jared@example.com');
    await expect(input).toHaveValue('jared@example.com');
  },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'not-an-email' },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Email');
    await expect(input).toBeDisabled();
    await userEvent.type(input, 'ignored');
    await expect(input).toHaveValue('');
  },
};
