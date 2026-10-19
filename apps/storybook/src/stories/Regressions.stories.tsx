import type { Meta, StoryObj } from '@storybook/react-vite';
import { applyTheme } from '@machine-ui/theme-engine';
import { REFERENCE_THEMES } from '@machine-ui/tokens';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  DataTable,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  Stat,
  type ColumnDef,
} from '@machine-ui/ui';
import { useLayoutEffect, useRef } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

/** Tests for bugs found in review. Each story pins one fixed behaviour. */
const meta = { title: 'Regressions', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

export const CommandDoesNotScrollThePage: Story = {
  render: () => (
    <div>
      <div className="h-[200vh]" aria-hidden />
      <Command className="w-72 border">
        <CommandInput placeholder="Filter items" aria-label="Filter items" />
        <CommandList className="max-h-40">
          <CommandGroup heading="Items">
            {ITEMS.map((item) => (
              <CommandItem key={item}>{item}</CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
  play: async ({ canvas }) => {
    // Mounting must not move the page, even though the list sits far below the fold.
    await new Promise((r) => setTimeout(r, 100));
    await expect(window.scrollY).toBe(0);

    // Keyboard navigation still keeps the selected item visible, by scrolling the list only.
    const input = canvas.getByRole('combobox');
    input.focus({ preventScroll: true });
    const list = input.closest('[cmdk-root]')!.querySelector<HTMLElement>('[cmdk-list]')!;
    const before = window.scrollY;
    await userEvent.keyboard('{ArrowDown>12/}');
    await waitFor(() => expect(list.scrollTop).toBeGreaterThan(0));
    const selected = list.querySelector<HTMLElement>('[aria-selected="true"]')!;
    const listBox = list.getBoundingClientRect();
    const itemBox = selected.getBoundingClientRect();
    await expect(itemBox.top).toBeGreaterThanOrEqual(listBox.top - 1);
    await expect(itemBox.bottom).toBeLessThanOrEqual(listBox.bottom + 1);
    await expect(window.scrollY).toBe(before);
  },
};

function ForgeScope({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const applied = applyTheme(REFERENCE_THEMES.find((t) => t.name === 'forge')!, { target: ref.current!, mode: 'light' });
    return () => applied.dispose();
  }, []);
  return (
    <div ref={ref} className="bg-background p-4 font-sans text-foreground">
      {children}
    </div>
  );
}

export const StatValueScalesToItsCard: Story = {
  render: () => (
    <ForgeScope>
      <div className="flex items-start gap-4">
        <div className="w-36 rounded-lg border p-4" data-testid="narrow">
          <Stat label="Monthly revenue" value="$48.2k" change="12.4%" trend="up" />
        </div>
        <div className="w-96 rounded-lg border p-4" data-testid="wide">
          <Stat label="Monthly revenue" value="$48.2k" change="12.4%" trend="up" />
        </div>
      </div>
    </ForgeScope>
  ),
  play: async ({ canvas }) => {
    // Display faces vary hugely in width, so the number sizes itself to its card, not the viewport.
    const size = (id: string) =>
      Number.parseFloat(getComputedStyle(canvas.getByTestId(id).querySelector('[data-slot=stat-value]')!).fontSize);
    await expect(size('narrow')).toBeLessThan(size('wide'));
  },
};

export const NestedSidebarIgnoresTheShortcut: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar data-testid="outer">
        <SidebarContent>Outer</SidebarContent>
      </Sidebar>
      <div className="flex-1 p-4">
        <SidebarProvider>
          <Sidebar data-testid="inner">
            <SidebarContent>Inner</SidebarContent>
          </Sidebar>
          <SidebarTrigger />
        </SidebarProvider>
      </div>
    </SidebarProvider>
  ),
  play: async ({ canvas }) => {
    const outer = canvas.getByTestId('outer');
    const inner = canvas.getByTestId('inner');
    await userEvent.keyboard('{Control>}b{/Control}');
    // The shortcut belongs to the app's own (outermost) sidebar only.
    await expect(outer).toHaveAttribute('data-state', 'collapsed');
    await expect(inner).toHaveAttribute('data-state', 'expanded');
    // The nested sidebar still toggles from its own trigger.
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle sidebar' }));
    await expect(inner).toHaveAttribute('data-state', 'collapsed');
  },
};

interface Row {
  name: string;
}
const ROWS: Row[] = Array.from({ length: 12 }, (_, i) => ({ name: i === 11 ? 'Zed' : `Person ${String(i + 1).padStart(2, '0')}` }));
const COLUMNS: ColumnDef<Row>[] = [{ accessorKey: 'name', header: 'Name' }];

export const DataTableFilterResetsToFirstPage: Story = {
  render: () => <DataTable columns={COLUMNS} data={ROWS} filterColumn="name" filterPlaceholder="Filter names" pageSize={5} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    const pager = canvas.getByText(/^Page \d+ of \d+$/);
    await expect(pager).toHaveTextContent('Page 3 of 3');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Filter names' }), 'Person 0');
    await waitFor(() => expect(pager).toHaveTextContent('Page 1 of 2'));
    const rows = within(canvas.getByRole('table')).getAllByRole('row').slice(1);
    await expect(rows).toHaveLength(5);
    await expect(rows[0]).toHaveTextContent('Person 01');
  },
};

export const NestedInsetIsNotASecondMain: Story = {
  render: () => (
    <SidebarProvider>
      <SidebarInset>
        <p>App content</p>
        <SidebarProvider>
          <SidebarInset>
            <p>Embedded demo</p>
          </SidebarInset>
        </SidebarProvider>
      </SidebarInset>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }) => {
    // One main landmark per page: an inset inside another sidebar layout is a plain region.
    await expect(canvasElement.querySelectorAll('main')).toHaveLength(1);
    await expect(canvasElement.querySelectorAll('[data-slot=sidebar-inset]')).toHaveLength(2);
  },
};
