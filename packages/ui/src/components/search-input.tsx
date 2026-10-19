'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './input-group.tsx';
import { Kbd } from './kbd.tsx';

/** A search field with a shortcut hint, and a clear button once there is a value. */
export function SearchInput({
  shortcut,
  className,
  value,
  defaultValue = '',
  onChange,
  onClear,
  ...props
}: Omit<ComponentProps<'input'>, 'value' | 'defaultValue'> & {
  shortcut?: string;
  value?: string;
  defaultValue?: string;
  onClear?: () => void;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  return (
    <InputGroup className={className}>
      <InputGroupAddon>
        <SearchIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={current}
        onChange={(e) => {
          setInternal(e.target.value);
          onChange?.(e);
        }}
        className="[&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      <InputGroupAddon align="end">
        {current ? (
          <InputGroupButton
            aria-label="Clear search"
            onClick={() => {
              setInternal('');
              onClear?.();
            }}
          >
            <XIcon aria-hidden />
          </InputGroupButton>
        ) : (
          shortcut && <Kbd className="mr-1.5">{shortcut}</Kbd>
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}
