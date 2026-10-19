import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/components/ui';

export function Settings() {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Label htmlFor="name">Name</Label>
        <Input id="name" className="h-(--control-md)" />
        <Button className="bg-primary text-primary-foreground">Save</Button>
      </CardContent>
    </Card>
  );
}
