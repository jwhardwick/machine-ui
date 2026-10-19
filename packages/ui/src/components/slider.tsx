'use client';

import { Slider as SliderPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing, transition } from '../lib/styles.ts';

export function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  const thumbs = value ?? defaultValue ?? [min];
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {thumbs.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          // The thumbs carry role="slider", so the label belongs on them, not the root.
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-slot="slider-thumb"
          className={cn(
            'block size-4 shrink-0 cursor-grab rounded-full border border-primary bg-background shadow-sm active:cursor-grabbing',
            transition,
            focusRing,
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
