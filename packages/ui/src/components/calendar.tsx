import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from '../lib/cn.ts';
import { buttonVariants } from './button.tsx';

/** A month grid for picking a date or a range. Wraps react-day-picker. */
export function Calendar({ className, classNames, showOutsideDays = true, ...props }: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn('w-fit p-3 text-foreground', className)}
      classNames={{
        root: 'relative',
        months: 'relative flex flex-col gap-4 sm:flex-row',
        month: 'flex w-full flex-col gap-4',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous: cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-(--control-sm) aria-disabled:opacity-50'),
        button_next: cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-(--control-sm) aria-disabled:opacity-50'),
        month_caption: 'flex h-(--control-sm) items-center justify-center px-8',
        caption_label: 'text-sm font-medium',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'flex-1 select-none text-xs font-normal text-muted-foreground',
        week: 'mt-1 flex w-full',
        day: 'relative aspect-square size-(--control-sm) p-0 text-center text-sm',
        day_button: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'size-full rounded-md font-normal aria-selected:opacity-100',
        ),
        selected:
          '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
        range_start: 'rounded-l-md bg-accent',
        range_middle: 'bg-accent [&>button]:bg-transparent! [&>button]:text-accent-foreground!',
        range_end: 'rounded-r-md bg-accent',
        today: '[&>button]:font-semibold [&>button]:underline [&>button]:underline-offset-4',
        outside: 'text-muted-foreground [&>button]:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      labels={{
        // Lead with the visible day number so the accessible name contains what sighted users see.
        labelDayButton: (date, modifiers) =>
          `${format(date, 'd MMMM yyyy, EEEE')}${modifiers.today ? ', today' : ''}${modifiers.selected ? ', selected' : ''}`,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass }) =>
          orientation === 'left' ? (
            <ChevronLeftIcon aria-hidden className={cn('size-4', chevronClass)} />
          ) : (
            <ChevronRightIcon aria-hidden className={cn('size-4', chevronClass)} />
          ),
      }}
      {...props}
    />
  );
}
