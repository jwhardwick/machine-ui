import type { Meta, StoryObj } from '@storybook/react-vite';
import { ApprovalCard, PromptInput, StreamingText } from '@machine-ui/ui';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { example } from './helpers.tsx';

const meta = { title: 'Interactions/AI elements' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const PromptEnterSendsShiftEnterBreaks: Story = {
  args: { onSubmit: fn() },
  render: (args) => <PromptInput className="max-w-xl" onSubmit={args.onSubmit as (v: string) => void} />,
  play: async ({ args, canvas }) => {
    const box = canvas.getByRole('textbox', { name: 'Message' });
    const send = canvas.getByRole('button', { name: 'Send message' });
    await expect(send).toBeDisabled();
    await userEvent.type(box, 'First line{Shift>}{Enter}{/Shift}second line');
    await expect(box).toHaveValue('First line\nsecond line');
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledWith('First line\nsecond line');
    await expect(box).toHaveValue('');
  },
};

export const PromptBusyStops: Story = {
  args: { onStop: fn() },
  render: (args) => <PromptInput busy className="max-w-xl" onStop={args.onStop as () => void} />,
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Stop generating' }));
    await expect(args.onStop).toHaveBeenCalledOnce();
  },
};

export const ToolCallDiscloses: Story = {
  render: example('tool-call', 'States'),
  play: async ({ canvas }) => {
    const failed = canvas.getByRole('button', { name: /github.create_issue/ });
    await expect(failed).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(failed);
    await expect(failed).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('403: token lacks repo scope')).toBeVisible();
  },
};

export const ApprovalConfirmsChoice: Story = {
  args: { onConfirm: fn() },
  render: (args) => (
    <ApprovalCard
      className="max-w-md"
      question="Archive 42 idle tickets?"
      options={[
        { value: 'archive', label: 'Archive them' },
        { value: 'review', label: 'Show me first' },
      ]}
      onConfirm={args.onConfirm as (v: string) => void}
    />
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Show me first' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm' }));
    await expect(args.onConfirm).toHaveBeenCalledWith('review');
  },
};

export const StreamingFinishesOnce: Story = {
  args: { onDone: fn() },
  render: (args) => <StreamingText text="Done in a moment." speed={200} onDone={args.onDone as () => void} />,
  play: async ({ args, canvasElement }) => {
    const text = canvasElement.querySelector('[data-slot=streaming-text]')!;
    await waitFor(() => expect(text).toHaveAttribute('aria-busy', 'false'));
    await expect(text).toHaveTextContent('Done in a moment.');
    await waitFor(() => expect(args.onDone).toHaveBeenCalledOnce());
  },
};
