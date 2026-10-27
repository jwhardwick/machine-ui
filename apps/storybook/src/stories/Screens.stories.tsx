import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodingAgentScreen, DashboardScreen, SettingsScreen } from '@machine-ui/examples';
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

export const CodingAgent: Story = {
  render: () => <CodingAgentScreen />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('radio', { name: /Push and open a draft PR/ }));
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm' }));
    await expect(canvas.getByRole('button', { name: /gh pr create --draft/ })).toBeVisible();
    // Replies stream in; the composer's stop button turns back into send when one finishes.
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Send message' })).toBeInTheDocument(), { timeout: 30_000 });
    await expect(canvas.getByText(/opened draft PR #482/)).toBeVisible();

    const box = canvas.getByRole('textbox', { name: 'Ask Alpha' });
    await userEvent.type(box, 'Add a regression test{Enter}');
    await expect(canvas.getByText('Add a regression test', { selector: '[data-slot=message-content]' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Stop generating' })).toBeVisible();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Send message' })).toBeInTheDocument(), { timeout: 30_000 });
    await expect(canvas.getByText(/run the checkout suite again/)).toBeVisible();
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
