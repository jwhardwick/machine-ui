import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@machine-ui/ui';

const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Quarterly report</CardTitle>
        <CardDescription>Revenue and retention for Q3.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Net revenue grew 12% while churn held steady at 2.1%.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Open</Button>
        <Button size="sm" variant="ghost">
          Share
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardContent className="pt-6">A card without a header, for simple grouped content.</CardContent>
    </Card>
  ),
};
