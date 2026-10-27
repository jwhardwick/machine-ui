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
            <AlertTitle>Alpha 4.1 is out</AlertTitle>
            <AlertDescription>Restart your running sessions to use it.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <CircleCheck aria-hidden />
            <AlertTitle>Pull request merged</AlertTitle>
            <AlertDescription>Pull request #482 is on main, and its preview deploy has been cleaned up.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlert aria-hidden />
            <AlertTitle>Usage at 90%</AlertTitle>
            <AlertDescription>You have 2,000 agent minutes left this month.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlert aria-hidden />
            <AlertTitle>Run failed</AlertTitle>
            <AlertDescription>The agent stopped at pnpm typecheck. Check the logs and try again.</AlertDescription>
          </Alert>
        </div>
      ),
    },
  ],
});
