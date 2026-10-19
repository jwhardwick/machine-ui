import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import { useContext, type ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { transition } from '../lib/styles.ts';

export function InputOTP({
  className,
  containerClassName,
  ...props
}: ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

export function InputOTPGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="input-otp-group" className={cn('flex items-center', className)} {...props} />;
}

export function InputOTPSlot({ index, className, ...props }: ComponentProps<'div'> & { index: number }) {
  const context = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = context?.slots[index] ?? {};
  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'relative flex size-(--control-md) items-center justify-center border-y border-r border-input bg-background font-mono text-base text-foreground shadow-sm first:rounded-l-md first:border-l last:rounded-r-md',
        transition,
        'data-[active=true]:z-10 data-[active=true]:outline-2 data-[active=true]:outline-offset-0 data-[active=true]:outline-ring',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-foreground" />
        </div>
      )}
    </div>
  );
}

export function InputOTPSeparator(props: ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" className="text-muted-foreground" {...props}>
      <MinusIcon aria-hidden className="size-4" />
    </div>
  );
}
