import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodingAgentScreen, DashboardScreen, SettingsScreen } from '@machine-ui/examples';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

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
    const model = canvas.getByRole('combobox', { name: 'Model' });
    await userEvent.click(model);
    await userEvent.click(await screen.findByRole('option', { name: 'Nucleus 3' }));
    await waitFor(() => expect(model).toHaveTextContent('Nucleus 3'));

    await userEvent.click(canvas.getByRole('radio', { name: /Push and open a draft PR/ }));
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm' }));
    await expect(canvas.getByRole('button', { name: /gh pr create --draft/ })).toBeVisible();
    // Replies stream in; the composer's stop button turns back into send when one finishes.
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Send message' })).toBeInTheDocument(), { timeout: 30_000 });
    await expect(canvas.getByText(/opened draft PR #482/)).toBeVisible();

    const box = canvas.getByRole('textbox', { name: 'Ask the agent' });
    await userEvent.type(box, 'Add a regression test{Enter}');
    await expect(canvas.getByText('Add a regression test', { selector: '[data-slot=message-content]' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Stop generating' })).toBeVisible();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Send message' })).toBeInTheDocument(), { timeout: 30_000 });
    await expect(canvas.getByText(/run the Weissman benchmark again/)).toBeVisible();
  },
};

export const UsageDashboard: Story = {
  render: () => <DashboardScreen />,
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table');
    await userEvent.click(within(table).getByRole('button', { name: /Cost/ }));
    await userEvent.click(within(table).getByRole('button', { name: /Cost/ }));
    await expect(within(table).getAllByRole('row')[1]).toHaveTextContent('pied-piper/middle-out');
  },
};

export const WorkspaceSettings: Story = {
  render: () => <SettingsScreen />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'Billing' }));
    await expect(canvas.getByRole('progressbar', { name: 'Seats' })).toBeVisible();
    await userEvent.click(canvas.getByRole('tab', { name: 'Team' }));
    await expect(canvas.getByText('Dinesh Chugtai')).toBeVisible();
  },
};
