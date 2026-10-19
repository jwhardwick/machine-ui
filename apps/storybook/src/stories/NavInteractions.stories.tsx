import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { example } from './helpers.tsx';

const meta = { title: 'Interactions/Navigation and layout' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const AccordionTogglesSections: Story = {
  render: example('accordion', 'FAQ'),
  play: async ({ canvas }) => {
    const fonts = canvas.getByRole('button', { name: 'Can I use my own fonts?' });
    await userEvent.click(fonts);
    await expect(fonts).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('button', { name: 'How is contrast guaranteed?' })).toHaveAttribute('aria-expanded', 'false');
  },
};

export const CollapsibleReveals: Story = {
  render: example('collapsible', 'Default'),
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('docs/decisions/0002.md')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle file list' }));
    await expect(canvas.getByText('docs/decisions/0002.md')).toBeVisible();
  },
};

export const MenubarMovesAcross: Story = {
  render: example('menubar', 'Editor'),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('menuitem', { name: 'File' }));
    const shown = await screen.findByRole('menuitem', { name: /New file/ });
    await waitFor(() => expect(shown).toBeVisible());
    await userEvent.keyboard('{ArrowRight}');
    const shown2 = await screen.findByRole('menuitem', { name: /Undo/ });
    await waitFor(() => expect(shown2).toBeVisible());
    await userEvent.keyboard('{Escape}');
  },
};

export const NavigationMenuOpens: Story = {
  render: example('navigation-menu', 'Default'),
  // Radix renders an aria-hidden, focusable proxy span while open to route Tab into the viewport.
  // axe reports it as aria-hidden-focus; it's intentional focus management, so only that rule is off here.
  parameters: { a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } } },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Product' }));
    const shown = await canvas.findByRole('link', { name: /Theme engine/ });
    await waitFor(() => expect(shown).toBeVisible());
  },
};

export const CarouselAdvances: Story = {
  render: example('carousel', 'Default'),
  play: async ({ canvas }) => {
    const prev = canvas.getByRole('button', { name: 'Previous slide' });
    const next = canvas.getByRole('button', { name: 'Next slide' });
    await waitFor(() => expect(next).toBeEnabled());
    await expect(prev).toBeDisabled();
    await userEvent.click(next);
    await waitFor(() => expect(prev).toBeEnabled());
  },
};

export const SidebarCollapsesToIcons: Story = {
  render: example('sidebar', 'App shell'),
  play: async ({ canvasElement, canvas }) => {
    const sidebar = canvasElement.querySelector('[data-slot=sidebar]')!;
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle sidebar' }));
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    await userEvent.keyboard('{Control>}b{/Control}');
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');
  },
};

export const DataTableSortsFiltersSelects: Story = {
  render: example('data-table', 'Members'),
  play: async ({ canvas }) => {
    const rows = () => within(canvas.getByRole('table')).getAllByRole('row').slice(1);
    await userEvent.click(canvas.getByRole('button', { name: /Name/ }));
    await expect(rows()[0]).toHaveTextContent('Ada Lovelace');
    await userEvent.click(canvas.getByRole('button', { name: /Name/ }));
    await expect(rows()[0]).toHaveTextContent('Radia Perlman');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Filter by name…' }), 'grace');
    await waitFor(() => expect(rows()).toHaveLength(1));
    await userEvent.click(within(rows()[0]!).getByRole('checkbox', { name: 'Select row' }));
    await expect(canvas.getByText('1 of 1 selected')).toBeVisible();
  },
};

export const MenubarSubmenuAndRadio: Story = {
  render: example('menubar', 'Editor'),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('menuitem', { name: 'View' }));
    const zoom = await screen.findByRole('menuitemradio', { name: '100%' });
    await expect(zoom).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Escape}');
    await userEvent.click(canvas.getByRole('menuitem', { name: 'File' }));
    const exportItem = await screen.findByRole('menuitem', { name: 'Export' });
    exportItem.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'theme.css' })).toHaveFocus());
    await userEvent.keyboard('{Escape}');
  },
};

export const DataTablePaginates: Story = {
  render: example('data-table', 'Members'),
  play: async ({ canvas }) => {
    const pager = canvas.getByText(/^Page \d+ of \d+$/);
    await expect(pager).toHaveTextContent('Page 1 of 2');
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(pager).toHaveTextContent('Page 2 of 2');
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeDisabled();
  },
};
