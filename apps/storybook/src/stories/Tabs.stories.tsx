import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@machine-ui/ui';
import { expect, userEvent } from 'storybook/test';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  render: () => (
    <Tabs defaultValue="css" className="max-w-md">
      <TabsList>
        <TabsTrigger value="css">CSS</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
        <TabsTrigger value="brief">Brief</TabsTrigger>
      </TabsList>
      <TabsContent value="css">CSS variables for :root.</TabsContent>
      <TabsContent value="json">Token file for tooling.</TabsContent>
      <TabsContent value="brief">Personality notes for agents.</TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const css = canvas.getByRole('tab', { name: 'CSS' });
    await expect(css).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(css);
    await userEvent.keyboard('{ArrowRight}');
    const json = canvas.getByRole('tab', { name: 'JSON' });
    await expect(json).toHaveFocus();
    await expect(json).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Token file for tooling.');
  },
};
