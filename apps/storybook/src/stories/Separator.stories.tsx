import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from '@machine-ui/ui';

const meta = {
  title: 'Components/Separator',
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="max-w-sm">
      <p className="font-medium">machine-ui</p>
      <p className="text-sm text-muted-foreground">A theming-first design system.</p>
      <Separator className="my-4" />
      <p className="text-sm">Docs · Themes · Changelog</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-3 text-sm">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Themes</span>
      <Separator orientation="vertical" />
      <span>Changelog</span>
    </div>
  ),
};
