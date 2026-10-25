import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, Input, Switch } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'field',
  name: 'Field',
  category: 'forms',
  description: 'Lays out the label, control, help text, and error for one form field, so your forms look consistent.',
  examples: [
    {
      name: 'Form',
      render: () => (
        <FieldSet className="w-full max-w-sm">
          <FieldLegend>Billing contact</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="field-name">Full name</FieldLabel>
              <Input id="field-name" defaultValue="Ada Lovelace" />
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="field-email">Email</FieldLabel>
              <Input id="field-email" aria-invalid defaultValue="ada@" aria-describedby="field-email-error" />
              <FieldError id="field-email-error">Enter an email like ada@example.com.</FieldError>
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="field-receipts">Email receipts</FieldLabel>
              <Switch id="field-receipts" defaultChecked />
            </Field>
            <FieldDescription>Receipts go to the billing contact, not the account owner.</FieldDescription>
          </FieldGroup>
        </FieldSet>
      ),
    },
  ],
});
