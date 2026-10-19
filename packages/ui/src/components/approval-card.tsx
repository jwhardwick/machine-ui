import { ShieldQuestionIcon } from 'lucide-react';
import { useId, useState, type ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { Button } from './button.tsx';
import { Label } from './label.tsx';
import { RadioGroup, RadioGroupItem } from './radio-group.tsx';

export interface ApprovalOption {
  value: string;
  label: string;
  description?: string;
}

/** The agent asks before it acts: a question, options, and Confirm or Skip. */
export function ApprovalCard({
  question,
  options,
  defaultValue,
  onConfirm,
  onSkip,
  className,
  ...props
}: Omit<ComponentProps<'div'>, 'onChange'> & {
  question: string;
  options: ApprovalOption[];
  defaultValue?: string;
  onConfirm?: (value: string) => void;
  onSkip?: () => void;
}) {
  const id = useId();
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? '');
  return (
    <div data-slot="approval-card" role="group" aria-labelledby={`${id}-q`} className={cn('grid gap-3 rounded-lg border bg-card p-4 text-sm', className)} {...props}>
      <div className="flex items-start gap-2">
        <ShieldQuestionIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p id={`${id}-q`} className="font-medium">
          {question}
        </p>
      </div>
      <RadioGroup value={value} onValueChange={setValue} aria-labelledby={`${id}-q`} className="gap-2">
        {options.map((option) => (
          <Label
            key={option.value}
            htmlFor={`${id}-${option.value}`}
            className="flex cursor-pointer items-start gap-3 rounded-md border p-3 font-normal leading-snug has-[[data-state=checked]]:border-primary"
          >
            <RadioGroupItem id={`${id}-${option.value}`} value={option.value} className="mt-0.5" />
            <span className="grid gap-0.5">
              <span className="font-medium">{option.label}</span>
              {option.description && <span className="text-muted-foreground">{option.description}</span>}
            </span>
          </Label>
        ))}
      </RadioGroup>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Skip
        </Button>
        <Button size="sm" onClick={() => onConfirm?.(value)}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
