import { Alert, AlertDescription, AlertTitle } from '@machine-ui/ui';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'alert',
  name: 'Alert',
  category: 'feedback',
  description: 'An inline banner with a title and a description, in default, success, warning, and destructive variants.',
  examples: [
    {
      name: 'Variants',
      render: () => (
        <div className="grid w-full max-w-lg gap-3">
          <Alert>
            <Info aria-hidden />
            <AlertTitle>New version available</AlertTitle>
            <AlertDescription>Reload to get the latest components.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <CircleCheck aria-hidden />
            <AlertTitle>Theme published</AlertTitle>
            <AlertDescription>Everyone with the link now sees the new colours.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlert aria-hidden />
            <AlertTitle>Usage at 90%</AlertTitle>
            <AlertDescription>You have 2,000 requests left this month.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlert aria-hidden />
            <AlertTitle>Deploy failed</AlertTitle>
            <AlertDescription>The build stopped at step 3. Check the logs and retry.</AlertDescription>
          </Alert>
        </div>
      ),
    },
  ],
});
