import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CopyInput,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  NativeSelect,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@machine-ui/ui';
import { UserPlus } from 'lucide-react';

const MEMBERS = [
  ['Richard Hendricks', 'richard@machine-co.dev', 'Owner'],
  ['Bertram Gilfoyle', 'gilfoyle@machine-co.dev', 'Admin'],
  ['Dinesh Chugtai', 'dinesh@machine-co.dev', 'Member'],
] as const;

const NOTIFICATIONS = [
  ['Failed runs', 'Email me when an agent run fails on main.', true],
  ['Weekly digest', 'A Monday summary of sessions, merges, and spend.', true],
  ['Product news', 'New models and agent features, about once a month.', false],
] as const;

/** Workspace settings across tabs: profile form, notifications, billing with usage, team and a danger zone. */
export function SettingsScreen() {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="mx-auto grid max-w-3xl gap-6 px-4 py-8">
        <div className="grid gap-1">
          <h2 className="font-display text-2xl font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage the machine-co workspace.</p>
        </div>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="grid gap-6 pt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workspace</CardTitle>
                <CardDescription>Shown on invites, receipts and shared links.</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="ws-name">Name</FieldLabel>
                    <Input id="ws-name" defaultValue="machine-co" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="ws-about">Description</FieldLabel>
                    <Textarea id="ws-about" defaultValue="Coding agents and tooling for the machine-co product teams." />
                    <FieldDescription>Up to 200 characters.</FieldDescription>
                  </Field>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="ws-region">Data region</FieldLabel>
                      <NativeSelect id="ws-region" defaultValue="eu">
                        <option value="us">United States</option>
                        <option value="eu">European Union</option>
                        <option value="au">Australia</option>
                      </NativeSelect>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="ws-lang">Default language</FieldLabel>
                      <Select defaultValue="en-gb">
                        <SelectTrigger id="ws-lang" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-gb">English (UK)</SelectItem>
                          <SelectItem value="en-us">English (US)</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="ws-key">API key</FieldLabel>
                    <CopyInput id="ws-key" value="mc_live_8f2k1x9q4m" />
                  </Field>
                </FieldGroup>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="ghost">Discard</Button>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-lg">Delete workspace</CardTitle>
                <CardDescription>Removes 14 repositories’ sessions and run history for every member.</CardDescription>
              </CardHeader>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete workspace</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete machine-co?</AlertDialogTitle>
                      <AlertDialogDescription>This can’t be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep workspace</AlertDialogCancel>
                      <AlertDialogAction variant="destructive">Delete workspace</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="pt-2">
            <ItemGroup className="gap-2">
              {NOTIFICATIONS.map(([title, body, on]) => (
                <Item key={title} variant="outline">
                  <ItemContent>
                    <ItemTitle>{title}</ItemTitle>
                    <ItemDescription>{body}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Switch aria-label={title} defaultChecked={on} />
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </TabsContent>

          <TabsContent value="billing" className="pt-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">Scale plan</CardTitle>
                  <Badge variant="secondary">Renews 1 Nov</Badge>
                </div>
                <CardDescription>$240 a month for up to 25 seats.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span id="usage-seats">Seats</span>
                    <span className="tabular-nums text-muted-foreground">19 of 25</span>
                  </div>
                  <Progress aria-labelledby="usage-seats" value={76} />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span id="usage-builds">Agent minutes this month</span>
                    <span className="tabular-nums text-muted-foreground">4,120 of 5,000</span>
                  </div>
                  <Progress aria-labelledby="usage-builds" value={82} />
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline">Change plan</Button>
                <Button variant="link">Download invoices</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="grid gap-4 pt-2">
            <div className="flex justify-end">
              <Button size="sm">
                <UserPlus aria-hidden /> Invite member
              </Button>
            </div>
            <ItemGroup className="divide-y rounded-lg border">
              {MEMBERS.map(([name, email, role]) => (
                <Item key={email} size="sm" className="rounded-none">
                  <ItemMedia>
                    <Avatar>
                      <AvatarFallback>
                        {name
                          .split(' ')
                          .map((p) => p[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{name}</ItemTitle>
                    <ItemDescription>{email}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant={role === 'Owner' ? 'default' : 'outline'}>{role}</Badge>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
