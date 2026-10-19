import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatScreen, DashboardScreen, SettingsScreen } from '@machine-ui/examples';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const meta = {
  title: 'Screens',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="h-dvh min-h-160">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AgentInbox: Story = {
  render: () => <ChatScreen />,
  play: async ({ canvas }) => {
    const box = canvas.getByRole('textbox', { name: 'Ask Alpha' });
    await userEvent.type(box, 'Any other open tickets?{Enter}');
    await expect(canvas.getByText('Any other open tickets?')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Stop generating' })).toBeVisible();
    // The reply arrives after a simulated delay and then streams in; wait for it to finish.
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Send message' })).toBeInTheDocument(), { timeout: 30_000 });
    await expect(canvas.getByText(/Two tickets are still open with Acme/)).toBeVisible();
  },
};

export const StoreDashboard: Story = {
  render: () => <DashboardScreen />,
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table');
    await userEvent.click(within(table).getByRole('button', { name: /Total/ }));
    await userEvent.click(within(table).getByRole('button', { name: /Total/ }));
    await expect(within(table).getAllByRole('row')[1]).toHaveTextContent('Acme');
  },
};

export const WorkspaceSettings: Story = {
  render: () => <SettingsScreen />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'Billing' }));
    await expect(canvas.getByRole('progressbar', { name: 'Seats' })).toBeVisible();
    await userEvent.click(canvas.getByRole('tab', { name: 'Team' }));
    await expect(canvas.getByText('Grace Hopper')).toBeVisible();
  },
};
