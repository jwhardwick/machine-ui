import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { example } from './helpers.ts';

const meta = { title: 'Interactions/Forms' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const SelectPicksAnOption: Story = {
  render: example('select', 'Grouped'),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Model' });
    await expect(trigger).toHaveTextContent('Balanced');
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('option', { name: 'Deep research' }));
    await expect(trigger).toHaveTextContent('Deep research');
    await expect(trigger).toHaveFocus();
  },
};

export const ComboboxFiltersAndSelects: Story = {
  render: example('combobox', 'Default'),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Time zone' });
    await userEvent.click(trigger);
    await userEvent.keyboard('syd');
    await waitFor(() => expect(screen.queryByRole('option', { name: 'Tokyo (GMT+9)' })).toBeNull());
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveTextContent('Sydney (GMT+11)');
  },
};

export const DatePickerChoosesADay: Story = {
  render: example('date-picker', 'Default'),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Launch date' });
    await expect(trigger).toHaveTextContent('3 Nov 2026');
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('button', { name: /^12 November 2026/ }));
    await waitFor(() => expect(trigger).toHaveTextContent('12 Nov 2026'));
  },
};

export const RadioGroupMovesWithArrows: Story = {
  render: example('radio-group', 'Default'),
  play: async ({ canvas }) => {
    const weekly = canvas.getByRole('radio', { name: 'Mondays only' });
    await expect(weekly).toBeChecked();
    await userEvent.click(weekly);
    // Radix moves focus on a timer and only checks while the arrow is held, so hold it like a person does.
    await userEvent.keyboard('{ArrowDown>}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Never' })).toBeChecked());
    await userEvent.keyboard('{/ArrowDown}');
  },
};

export const SliderStepsWithKeyboard: Story = {
  render: example('slider', 'Single'),
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole('slider', { name: 'Volume' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect(thumb).toHaveAttribute('aria-valuenow', '62');
  },
};

export const ToggleGroupSelectsOne: Story = {
  render: example('toggle-group', 'Single'),
  play: async ({ canvas }) => {
    const centre = canvas.getByRole('radio', { name: 'Align centre' });
    await userEvent.click(centre);
    await expect(centre).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('radio', { name: 'Align left' })).toHaveAttribute('aria-checked', 'false');
  },
};

export const TogglePresses: Story = {
  render: example('toggle', 'Variants'),
  play: async ({ canvas }) => {
    const bold = canvas.getByRole('button', { name: 'Bold' });
    await userEvent.click(bold);
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
  },
};

export const OtpAdvancesAsYouType: Story = {
  render: example('input-otp', 'Six digits'),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Verification code');
    await userEvent.click(input);
    await userEvent.keyboard('482913');
    await expect(input).toHaveValue('482913');
  },
};

export const SearchInputClears: Story = {
  render: example('search-input', 'With value'),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('searchbox', { name: 'Search threads' });
    await expect(input).toHaveValue('refund');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(input).toHaveValue('');
  },
};

export const CheckboxIndeterminate: Story = {
  render: example('checkbox', 'States'),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Some teams selected' })).toHaveAttribute('aria-checked', 'mixed');
  },
};
