import { ArrowUpIcon, SquareIcon } from 'lucide-react';
import { useRef, useState, type ComponentProps, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';
import { Button } from './button.tsx';

export interface PromptInputProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  /** While true, the send button becomes a stop button. */
  busy?: boolean;
  placeholder?: string;
  /** Extra controls in the toolbar's left side: attach, model picker. */
  tools?: ReactNode;
  hint?: ReactNode;
  label?: string;
}

/** A composer: auto-growing text, a toolbar and a send button. Enter sends, Shift+Enter adds a line. */
export function PromptInput({
  onSubmit,
  onStop,
  busy = false,
  placeholder = 'Ask anything…',
  tools,
  hint,
  label = 'Message',
  className,
  ...props
}: PromptInputProps) {
  const [value, setValue] = useState('');
  const textarea = useRef<HTMLTextAreaElement>(null);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (busy) return onStop?.();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setValue('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form data-slot="prompt-input" onSubmit={submit} className={cn('grid gap-1.5', className)} {...props}>
      <div className="grid gap-2 rounded-xl border border-input bg-card p-2 shadow-sm has-[textarea:focus-visible]:outline-2 has-[textarea:focus-visible]:outline-offset-2 has-[textarea:focus-visible]:outline-ring">
        <textarea
          ref={textarea}
          aria-label={label}
          rows={1}
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="field-sizing-content max-h-48 min-h-10 w-full resize-none bg-transparent px-2 py-1.5 text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
        />
        <div className="flex items-center gap-1">
          <div className="flex flex-1 items-center gap-1">{tools}</div>
          <Button
            type="submit"
            size="icon"
            className="size-(--control-sm) rounded-lg"
            disabled={!busy && !value.trim()}
            aria-label={busy ? 'Stop generating' : 'Send message'}
          >
            {busy ? <SquareIcon aria-hidden className="fill-current" /> : <ArrowUpIcon aria-hidden />}
          </Button>
        </div>
      </div>
      {hint && <p className="px-1 text-xs text-muted-foreground">{hint}</p>}
    </form>
  );
}

/** Suggested prompts as quiet pills. */
export function PromptSuggestions({
  suggestions,
  onPick,
  className,
  ...props
}: Omit<ComponentProps<'div'>, 'onClick'> & { suggestions: string[]; onPick?: (suggestion: string) => void }) {
  return (
    <div data-slot="prompt-suggestions" className={cn('flex flex-wrap gap-2', className)} {...props}>
      {suggestions.map((suggestion) => (
        <Button key={suggestion} variant="outline" size="sm" className="rounded-full font-normal" onClick={() => onPick?.(suggestion)}>
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
