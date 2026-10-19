import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@machine-ui/ui';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Beta' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Draft' } };
export const Outline: Story = { args: { variant: 'outline', children: 'v0.1' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Failing' } };
