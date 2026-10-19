import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/cn.ts';
import { Button } from './button.tsx';
import { Calendar } from './calendar.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './popover.tsx';

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

/** A button that opens a Calendar and shows the chosen date. */
export function DatePicker({ value, defaultValue, onChange, placeholder = 'Pick a date', id, className, ...aria }: DatePickerProps) {
  const [internal, setInternal] = useState<Date | undefined>(defaultValue);
  const [open, setOpen] = useState(false);
  const date = value ?? internal;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          data-empty={!date}
          className={cn('w-56 justify-start font-normal data-[empty=true]:text-muted-foreground', className)}
          {...aria}
        >
          <CalendarIcon aria-hidden />
          {date ? format(date, 'd MMM yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(next) => {
            setInternal(next);
            onChange?.(next);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
