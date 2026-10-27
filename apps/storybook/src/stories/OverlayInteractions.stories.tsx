import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, screen, userEvent, waitFor, within } from 'storybook/test';
import { example } from './helpers.tsx';

const meta = { title: 'Interactions/Overlays' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const AlertDialogNeedsAnAnswer: Story = {
  render: example('alert-dialog', 'Destructive'),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete workspace' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete machine-co?' });
    await expect(screen.getByRole('button', { name: 'Keep workspace' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const DropdownMenuKeyboard: Story = {
  render: example('dropdown-menu', 'Account menu'),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Ada Lovelace' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /Profile/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: /Settings/ })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(menu).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const ContextMenuOpensOnRightClick: Story = {
  render: example('context-menu', 'Default'),
  play: async ({ canvas }) => {
    fireEvent.contextMenu(canvas.getByText('Right-click this file'));
    const shown = await screen.findByRole('menuitem', { name: /Rename/ });
    await waitFor(() => expect(shown).toBeVisible());
    await userEvent.keyboard('{Escape}');
  },
};

export const PopoverOpensAndCloses: Story = {
  render: example('popover', 'Settings'),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Limits' });
    await userEvent.click(trigger);
    await expect(await screen.findByLabelText('Minutes')).toHaveValue('45');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByLabelText('Minutes')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const TooltipOnFocus: Story = {
  render: example('tooltip', 'Icon button'),
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Notifications' })).toHaveFocus();
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('3 pull requests need your review');
  },
};

export const HoverCardOnFocus: Story = {
  render: example('hover-card', 'Profile preview'),
  play: async () => {
    await userEvent.tab();
    const shown = await screen.findByText('Ada Lovelace');
    await waitFor(() => expect(shown).toBeVisible());
  },
};

export const SheetTrapsFocus: Story = {
  render: example('sheet', 'Edit panel'),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Edit member' }));
    const sheet = await screen.findByRole('dialog', { name: 'Edit member' });
    await waitFor(() => expect(sheet.contains(document.activeElement)).toBe(true));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(sheet).not.toBeInTheDocument());
  },
};

export const DrawerOpens: Story = {
  render: example('drawer', 'Default'),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Set a budget' }));
    const shown = await screen.findByRole('dialog', { name: 'Session budget' });
    await waitFor(() => expect(shown).toBeVisible());
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    // vaul animates the close before unmounting; allow for a slow machine.
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), { timeout: 5000 });
  },
};

export const CommandFilters: Story = {
  render: example('command', 'Inline'),
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'bill');
    await waitFor(() => expect(canvas.getAllByRole('option')).toHaveLength(1));
    await expect(canvas.getByRole('option')).toHaveTextContent('Billing');
  },
};

export const ToastAppears: Story = {
  render: example('toast', 'Variants'),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Success' }));
    const shown = await screen.findByText('Pull request #482 is on main.');
    await waitFor(() => expect(shown).toBeVisible());
  },
};

export const CommandPaletteRunsAndCloses: Story = {
  render: example('command-palette', 'Default'),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /Open command palette/ });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog');
    await userEvent.keyboard('pref');
    await waitFor(() => expect(within(dialog).getAllByRole('option')).toHaveLength(1));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    // Focus returns to whatever opened the palette, not <body>.
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const DropdownSubmenuAndRadio: Story = {
  render: example('dropdown-menu', 'Account menu'),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Ada Lovelace' }));
    const left = await screen.findByRole('menuitemradio', { name: 'Left' });
    await expect(screen.getByRole('menuitemradio', { name: 'Right' })).toHaveAttribute('aria-checked', 'true');
    await expect(left).toHaveAttribute('aria-checked', 'false');
    const sub = screen.getByRole('menuitem', { name: 'Switch workspace' });
    sub.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'machine-co' })).toHaveFocus());
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(sub).toHaveFocus());
    await userEvent.keyboard('{Escape}');
  },
};

export const ContextMenuSubmenu: Story = {
  render: example('context-menu', 'Default'),
  play: async ({ canvas }) => {
    fireEvent.contextMenu(canvas.getByText('Right-click this file'));
    const share = await screen.findByRole('menuitem', { name: 'Share' });
    share.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Copy link' })).toHaveFocus());
    await expect(screen.getByRole('menuitemradio', { name: 'Last modified' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Escape}');
  },
};
