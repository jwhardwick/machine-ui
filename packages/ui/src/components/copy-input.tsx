import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './input-group.tsx';

/** A read-only field with a copy button, for API keys, webhook URLs and share links. */
export function CopyInput({ value, className, ...props }: Omit<ComponentProps<'input'>, 'value'> & { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <InputGroup className={className}>
      <InputGroupInput readOnly value={value} className="font-mono" {...props} />
      <InputGroupAddon align="end">
        <InputGroupButton
          aria-label={copied ? 'Copied' : 'Copy to clipboard'}
          onClick={async () => {
            await navigator.clipboard?.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
