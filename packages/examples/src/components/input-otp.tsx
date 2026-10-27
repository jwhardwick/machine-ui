import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, Label } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'input-otp',
  name: 'Input OTP',
  category: 'forms',
  description: 'One box per character for one-time codes. Focus moves to the next box as you type, and you can paste the whole code.',
  examples: [
    {
      name: 'Six digits',
      render: () => (
        <div className="grid gap-2">
          <Label htmlFor="otp">Verification code</Label>
          <InputOTP id="otp" maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      ),
    },
  ],
});
