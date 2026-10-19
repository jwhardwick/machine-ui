import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'card',
  name: 'Card',
  category: 'data',
  description:
    'Groups related content on a raised surface. Whether it uses a border or a shadow comes from the theme’s separation setting.',
  examples: [
    {
      name: 'Default',
      render: () => (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Quarterly report</CardTitle>
            <CardDescription>Revenue and retention for Q3.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">Net revenue grew 12% while churn held at 2.1%.</CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Open report</Button>
            <Button size="sm" variant="ghost">
              Share
            </Button>
          </CardFooter>
        </Card>
      ),
    },
  ],
});
