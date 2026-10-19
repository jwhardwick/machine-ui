import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@machine-ui/ui';
import { ArrowRight, Plus } from 'lucide-react';
import { expect, fn, userEvent } from 'storybook/test';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Save changes', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'icon'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete project' } };
export const Link: Story = { args: { variant: 'link', children: 'Read the docs' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };

export const WithIcon: Story = {
  args: {
    children: (
      <>
        Continue <ArrowRight aria-hidden />
      </>
    ),
  },
};

export const Icon: Story = {
  args: { size: 'icon', 'aria-label': 'Add item', children: <Plus aria-hidden /> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Add item' })).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Save changes' });
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const AsChildLink: Story = {
  args: { asChild: true, variant: 'outline', children: <a href="#docs">Open docs</a> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Open docs' })).toHaveAttribute('data-slot', 'button');
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
