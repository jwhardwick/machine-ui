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
          <FieldLegend>Commit author</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="field-name">Name</FieldLabel>
              <Input id="field-name" defaultValue="Alpha (machine-co)" />
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="field-email">Email</FieldLabel>
              <Input id="field-email" aria-invalid defaultValue="alpha@" aria-describedby="field-email-error" />
              <FieldError id="field-email-error">Enter an email like alpha@machine-co.dev.</FieldError>
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="field-sign">Sign commits</FieldLabel>
              <Switch id="field-sign" defaultChecked />
            </Field>
            <FieldDescription>The agent signs with the workspace key, not yours.</FieldDescription>
          </FieldGroup>
        </FieldSet>
      ),
    },
  ],
});
