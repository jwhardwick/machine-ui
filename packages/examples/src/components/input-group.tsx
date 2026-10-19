import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, Label } from '@machine-ui/ui';
import { AtSign } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'input-group',
  name: 'Input Group',
  category: 'forms',
  description: 'A text field with a fixed prefix, suffix or icon inside one border.',
  examples: [
    {
      name: 'Prefix and suffix',
      render: () => (
        <div className="grid w-full max-w-sm gap-4">
          <div className="grid gap-2">
            <Label htmlFor="ig-site">Website</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="ig-site" placeholder="northwind" className="pl-1" />
              <InputGroupAddon align="end">
                <InputGroupText>.com</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ig-handle">Handle</Label>
            <InputGroup>
              <InputGroupAddon>
                <AtSign aria-hidden />
              </InputGroupAddon>
              <InputGroupInput id="ig-handle" placeholder="ada" />
            </InputGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ig-invite">Invite by email</Label>
            <InputGroup>
              <InputGroupInput id="ig-invite" type="email" placeholder="grace@northwind.dev" />
              <InputGroupAddon align="end">
                <InputGroupButton variant="secondary">Send invite</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      ),
    },
  ],
});
