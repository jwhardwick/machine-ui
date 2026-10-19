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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Separator,
  Switch,
} from '@machine-ui/ui';
import { useId } from 'react';

const STATS = [
  { label: 'Monthly visitors', value: '48.2k', change: '+12%' },
  { label: 'Conversion', value: '3.9%', change: '+0.4pt' },
  { label: 'Open issues', value: '7', change: '−3' },
];

/** A small product UI so the theme is judged on something real, not swatches. */
export function Preview() {
  const id = useId();
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="gap-1">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{stat.change} this week</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workspace settings</CardTitle>
            <CardDescription>Changes apply to everyone in Northwind.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`${id}-name`}>Workspace name</Label>
              <Input id={`${id}-name`} defaultValue="Northwind" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${id}-domain`}>Custom domain</Label>
              <Input id={`${id}-domain`} aria-invalid defaultValue="northwind" aria-describedby={`${id}-domain-error`} />
              <p id={`${id}-domain-error`} className="text-sm text-destructive">
                Enter a full domain, like northwind.com.
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor={`${id}-digest`}>Weekly digest email</Label>
              <Switch id={`${id}-digest`} defaultChecked />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-sso`} />
              <Label htmlFor={`${id}-sso`}>Require single sign-on</Label>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost">Discard</Button>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>

        <div className="grid content-start gap-6">
          <Alert>
            <AlertTitle>Theme applied</AlertTitle>
            <AlertDescription>Every text pair on this page meets WCAG 2.2 AA in light and dark.</AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>Danger zone</CardTitle>
                <Badge variant="destructive">Irreversible</Badge>
              </div>
              <CardDescription>Deleting a workspace removes its themes, members and history.</CardDescription>
            </CardHeader>
            <CardFooter className="gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete workspace</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Northwind?</DialogTitle>
                    <DialogDescription>This can’t be undone. Type the workspace name to confirm.</DialogDescription>
                  </DialogHeader>
                  <Input aria-label="Workspace name" placeholder="Northwind" />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive">Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="link">Export data first</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
