import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@machine-ui/ui';
import { useId } from 'react';

/** A compact composition of every component, used to judge a theme at a glance. */
export function Showcase() {
  const id = useId();
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Live</Badge>
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="outline">v0.1</Badge>
        <Badge variant="destructive">2 failing</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invite your team</CardTitle>
          <CardDescription>Collaborators can edit themes and publish releases.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input id={`${id}-email`} type="email" placeholder="ada@example.com" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-admin`} defaultChecked />
            <Label htmlFor={`${id}-admin`}>Can publish</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id={`${id}-notify`} defaultChecked />
            <Label htmlFor={`${id}-notify`}>Send an email</Label>
          </div>
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          <Button>Send invite</Button>
          <Button variant="outline">Copy link</Button>
          <Button variant="ghost">Cancel</Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="text-sm">
          Eleven components, five reference themes, every pair contrast-solved.
        </TabsContent>
        <TabsContent value="activity" className="text-sm">
          Nothing new this week.
        </TabsContent>
      </Tabs>

      <Separator />

      <Alert variant="destructive">
        <AlertTitle>Release blocked</AlertTitle>
        <AlertDescription>Two visual baselines need review.</AlertDescription>
      </Alert>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm">
          Secondary
        </Button>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
        <Button variant="link" size="sm">
          Learn more
        </Button>
      </div>
    </div>
  );
}
