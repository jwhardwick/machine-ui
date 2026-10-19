'use client';

import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/cn.ts';
import { Button } from './button.tsx';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './popover.tsx';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

/** A select with a filter field: type to narrow the options, then pick one. */
export function Combobox({
  options,
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No matches.',
  id,
  className,
  ...aria
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const selected = options.find((o) => o.value === current);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-56 justify-between font-normal', !selected && 'text-muted-foreground', className)}
          {...aria}
        >
          {selected?.label ?? placeholder}
          <ChevronsUpDownIcon aria-hidden className="opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    const next = option.value === current ? '' : option.value;
                    setInternal(next);
                    onChange?.(next);
                    setOpen(false);
                  }}
                >
                  <CheckIcon aria-hidden className={cn(option.value === current ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
