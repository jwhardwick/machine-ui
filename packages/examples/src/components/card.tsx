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
            <CardTitle>Weekly agent report</CardTitle>
            <CardDescription>Sessions and pull requests for week 43.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">The agent opened 38 pull requests. 31 merged without changes.</CardContent>
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
