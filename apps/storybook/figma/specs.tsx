import {
  AgentGlyph,
  Alert,
  AlertDescription,
  AlertTitle,
  ApprovalCard,
  Avatar,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Citation,
  CodeBlock,
  ConfidenceBar,
  CopyInput,
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  H1,
  H2,
  H3,
  H4,
  InlineCode,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Kbd,
  Label,
  Lead,
  Message,
  MessageContent,
  Muted,
  NativeSelect,
  P,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Progress,
  PromptInput,
  RadioGroup,
  RadioGroupItem,
  SearchInput,
  Select,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Slider,
  Sources,
  Spinner,
  Stat,
  StatusDot,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThinkingIndicator,
  ThinkingSteps,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  ToolCall,
  type ThinkingStep,
} from '@machine-ui/ui';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  CircleAlert,
  CircleCheck,
  Info,
  Paperclip,
  Plus,
  SquareTerminal,
  Star,
  TriangleAlert,
} from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * What the Figma importer builds as components. Each spec lists its variant axes; the extractor
 * renders every combination and the plugin combines them into one component set.
 *
 * Specs are separate from the docs examples on purpose: an example shows several variants side by
 * side, a Figma variant is exactly one.
 */
export interface FigmaSpec {
  key: string;
  name: string;
  group: string;
  axes: Record<string, readonly string[]>;
  /** Width of the frame it renders in. Components that fill their container need one. */
  width?: number;
  /** Skip combinations that don't exist, e.g. a disabled link button. */
  skip?: (props: Record<string, string>) => boolean;
  render: (props: Record<string, string>) => ReactNode;
}

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';
type AlertVariant = 'default' | 'success' | 'warning' | 'destructive';

const ALERT_ICONS: Record<AlertVariant, ReactNode> = {
  default: <Info aria-hidden />,
  success: <CircleCheck aria-hidden />,
  warning: <TriangleAlert aria-hidden />,
  destructive: <CircleAlert aria-hidden />,
};

const ALERT_COPY: Record<AlertVariant, [string, string]> = {
  default: ['Machine 4.1 is out', 'Restart your running sessions to use it.'],
  success: ['Pull request merged', 'Pull request #482 is on main.'],
  warning: ['Usage at 90%', 'You have 2,000 agent minutes left this month.'],
  destructive: ['Deploy failed', 'The build step exited with code 1.'],
};

type ToggleVariant = 'default' | 'outline';
type StatusTone = 'online' | 'busy' | 'error' | 'offline' | 'accent';
type ToolStatus = 'running' | 'done' | 'error';

const RADIO_OPTIONS = [
  ['daily', 'Every morning'],
  ['weekly', 'Mondays only'],
  ['never', 'Never'],
] as const;

const TABS = [
  ['overview', 'Overview', '42 agent sessions this week. 2 pull requests were reverted.'],
  ['activity', 'Activity', 'Nothing new since yesterday.'],
  ['settings', 'Settings', 'Notifications are on for failed runs.'],
] as const;

const RUNS = [
  ['Run 1041', 'Passed', 'Push', '4m 12s'],
  ['Run 1043', 'Failed', 'Schedule', '7m 48s'],
] as const;

const STEPS: Record<string, ThinkingStep[]> = {
  started: [
    { label: 'Read the failing test', detail: 'e2e/upload.spec.ts', state: 'active' },
    { label: 'Bisect recent merges', state: 'upcoming' },
    { label: 'Patch the chunking flag', state: 'upcoming' },
  ],
  halfway: [
    { label: 'Read the failing test', detail: 'e2e/upload.spec.ts', state: 'done' },
    { label: 'Bisect recent merges', detail: 'PRs #470 to #477', state: 'done' },
    { label: 'Patch the chunking flag', state: 'active' },
  ],
  done: [
    { label: 'Read the failing test', detail: 'e2e/upload.spec.ts', state: 'done' },
    { label: 'Bisect recent merges', detail: 'PRs #470 to #477', state: 'done' },
    { label: 'Patch the chunking flag', detail: 'PR #482', state: 'done' },
  ],
};

const APPROVAL_OPTIONS = [
  { value: 'default', label: 'Add a default value', description: 'Existing rows pass, and the column stays required.' },
  { value: 'rollback', label: 'Roll back the migration', description: 'Safe now. The column comes back next release.' },
  { value: 'ask', label: 'Ask the team in #eng' },
];

const SOURCES = [
  { title: 'Issue #8812', url: 'https://github.com/machine-co/web/issues/8812' },
  { title: 'Changelog v2.14', url: 'https://machine-co.example/changelog/2-14' },
  { title: 'PR #477', url: 'https://github.com/machine-co/web/pull/477' },
];

const CODE_SNIPPET = `import { applyTheme } from '@machine-ui/theme-engine';

applyTheme({ name: 'harbor', hue: 195, chroma: 0.55, neutral: 'cool',
  radius: 0.25, density: 0.55, separation: 0.15,
  typePair: 'civic', typeRatio: 1.2, motion: 'subtle' });`;

export const FIGMA_SPECS: FigmaSpec[] = [
  {
    key: 'button',
    name: 'Button',
    group: 'Forms',
    axes: {
      variant: ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
      size: ['sm', 'md', 'lg', 'icon'],
      state: ['default', 'disabled'],
    },
    skip: ({ variant, size }) => variant === 'link' && size === 'icon',
    render: ({ variant, size, state }) => (
      <Button variant={variant as ButtonVariant} size={size as ButtonSize} disabled={state === 'disabled'} aria-label={size === 'icon' ? 'Add' : undefined}>
        {size === 'icon' ? <Plus aria-hidden /> : 'Run agent'}
      </Button>
    ),
  },
  {
    key: 'badge',
    name: 'Badge',
    group: 'Data display',
    axes: { variant: ['default', 'secondary', 'outline', 'destructive'] },
    render: ({ variant }) => <Badge variant={variant as BadgeVariant}>Merged</Badge>,
  },
  {
    key: 'input',
    name: 'Input',
    group: 'Forms',
    axes: { state: ['placeholder', 'filled', 'disabled', 'invalid'] },
    width: 320,
    render: ({ state }) => (
      <Input
        aria-label="Repository"
        placeholder="org/repository"
        defaultValue={state === 'placeholder' ? undefined : 'piedpiper/middle-out'}
        disabled={state === 'disabled'}
        aria-invalid={state === 'invalid' || undefined}
      />
    ),
  },
  {
    key: 'card',
    name: 'Card',
    group: 'Data display',
    axes: { footer: ['true', 'false'] },
    width: 384,
    render: ({ footer }) => (
      <Card>
        <CardHeader>
          <CardTitle>Weekly agent report</CardTitle>
          <CardDescription>Sessions and pull requests for week 43.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">The agent opened 38 pull requests. 31 merged without changes.</CardContent>
        {footer === 'true' && (
          <CardFooter className="gap-2">
            <Button size="sm">Open report</Button>
            <Button size="sm" variant="ghost">
              Share
            </Button>
          </CardFooter>
        )}
      </Card>
    ),
  },
  {
    key: 'alert',
    name: 'Alert',
    group: 'Feedback',
    axes: { variant: ['default', 'success', 'warning', 'destructive'] },
    width: 480,
    render: ({ variant }) => {
      const v = variant as AlertVariant;
      return (
        <Alert variant={v}>
          {ALERT_ICONS[v]}
          <AlertTitle>{ALERT_COPY[v][0]}</AlertTitle>
          <AlertDescription>{ALERT_COPY[v][1]}</AlertDescription>
        </Alert>
      );
    },
  },
  // ---- Forms ----
  {
    key: 'checkbox',
    name: 'Checkbox',
    group: 'Forms',
    axes: { checked: ['false', 'true', 'indeterminate'], state: ['default', 'disabled'], label: ['true', 'false'] },
    render: ({ checked, state, label }) => {
      const box = (
        <Checkbox
          id="figma-checkbox"
          aria-label={label === 'true' ? undefined : 'Let the agent install dependencies'}
          checked={checked === 'indeterminate' ? 'indeterminate' : checked === 'true'}
          disabled={state === 'disabled'}
        />
      );
      if (label !== 'true') return box;
      return (
        <div className="inline-flex items-center gap-2">
          {box}
          <Label htmlFor="figma-checkbox">Let the agent install dependencies</Label>
        </div>
      );
    },
  },
  {
    key: 'switch',
    name: 'Switch',
    group: 'Forms',
    axes: { checked: ['false', 'true'], state: ['default', 'disabled'], label: ['true', 'false'] },
    render: ({ checked, state, label }) => {
      const control = (
        <Switch
          id="figma-switch"
          aria-label={label === 'true' ? undefined : 'Fix lint errors automatically'}
          checked={checked === 'true'}
          disabled={state === 'disabled'}
        />
      );
      if (label !== 'true') return control;
      return (
        <div className="inline-flex items-center gap-2">
          {control}
          <Label htmlFor="figma-switch">Fix lint errors automatically</Label>
        </div>
      );
    },
  },
  {
    key: 'radio-group',
    name: 'Radio Group',
    group: 'Forms',
    axes: { value: ['daily', 'weekly', 'never'], state: ['default', 'disabled'] },
    render: ({ value, state }) => (
      <RadioGroup value={value} disabled={state === 'disabled'} aria-label="Digest frequency" className="w-fit">
        {RADIO_OPTIONS.map(([v, label]) => (
          <div key={v} className="flex items-center gap-2">
            <RadioGroupItem value={v} id={`figma-rg-${v}`} />
            <Label htmlFor={`figma-rg-${v}`}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
    ),
  },
  {
    key: 'textarea',
    name: 'Textarea',
    group: 'Forms',
    axes: { state: ['placeholder', 'filled', 'disabled', 'invalid'] },
    width: 384,
    render: ({ state }) => (
      <Textarea
        aria-label="Task for the agent"
        placeholder="Run the Weissman score benchmark on every pull request…"
        defaultValue={state === 'placeholder' ? undefined : 'Bisect the merges since #470 and fix the flaky upload test.'}
        disabled={state === 'disabled'}
        aria-invalid={state === 'invalid' || undefined}
      />
    ),
  },
  {
    key: 'select',
    name: 'Select',
    group: 'Forms',
    axes: { state: ['placeholder', 'value', 'disabled'], size: ['sm', 'md'] },
    width: 224,
    render: ({ state, size }) => (
      <Select value={state === 'placeholder' ? undefined : 'balanced'} disabled={state === 'disabled'}>
        <SelectTrigger aria-label="Model" size={size as 'sm' | 'md'} className="w-full">
          <SelectValue placeholder="Choose a model">{state === 'placeholder' ? undefined : 'Balanced'}</SelectValue>
        </SelectTrigger>
      </Select>
    ),
  },
  {
    key: 'toggle',
    name: 'Toggle',
    group: 'Forms',
    axes: { variant: ['default', 'outline'], pressed: ['false', 'true'], content: ['icon', 'label'] },
    render: ({ variant, pressed, content }) => (
      <Toggle variant={variant as ToggleVariant} pressed={pressed === 'true'} aria-label={content === 'icon' ? 'Starred' : undefined}>
        <Star aria-hidden />
        {content === 'label' && 'My pull requests'}
      </Toggle>
    ),
  },
  {
    key: 'toggle-group',
    name: 'Toggle Group',
    group: 'Forms',
    axes: { variant: ['default', 'outline'], content: ['label', 'icon'] },
    render: ({ variant, content }) =>
      content === 'icon' ? (
        <ToggleGroup type="single" value="left" variant={variant as ToggleVariant} aria-label="Text alignment">
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align centre">
            <AlignCenter aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight aria-hidden />
          </ToggleGroupItem>
        </ToggleGroup>
      ) : (
        <ToggleGroup type="single" value="open" variant={variant as ToggleVariant} aria-label="Issue filters">
          <ToggleGroupItem value="open">Open</ToggleGroupItem>
          <ToggleGroupItem value="assigned">Assigned to me</ToggleGroupItem>
          <ToggleGroupItem value="blocked">Blocked</ToggleGroupItem>
        </ToggleGroup>
      ),
  },
  {
    key: 'slider',
    name: 'Slider',
    group: 'Forms',
    axes: { thumbs: ['single', 'range'], state: ['default', 'disabled'] },
    width: 320,
    render: ({ thumbs, state }) => (
      <Slider aria-label="Coverage target" value={thumbs === 'range' ? [20, 75] : [80]} max={100} disabled={state === 'disabled'} />
    ),
  },
  {
    key: 'search-input',
    name: 'Search Input',
    group: 'Forms',
    axes: { state: ['placeholder', 'filled'] },
    width: 320,
    render: ({ state }) => (
      <SearchInput aria-label="Search sessions" placeholder="Search sessions" shortcut="⌘K" defaultValue={state === 'filled' ? 'flaky test' : ''} />
    ),
  },
  {
    key: 'copy-input',
    name: 'Copy Input',
    group: 'Forms',
    axes: { state: ['default', 'disabled'] },
    width: 384,
    render: ({ state }) => (
      <CopyInput aria-label="Webhook URL" value="https://hooks.machine-co.dev/agent/8f2k1x" disabled={state === 'disabled'} />
    ),
  },
  {
    key: 'field',
    name: 'Field',
    group: 'Forms',
    axes: { state: ['default', 'invalid', 'disabled'] },
    width: 320,
    render: ({ state }) => (
      <Field data-invalid={state === 'invalid' || undefined} data-disabled={state === 'disabled' || undefined}>
        <FieldLabel htmlFor="figma-field">Email</FieldLabel>
        <Input
          id="figma-field"
          defaultValue={state === 'invalid' ? 'agent@' : 'agent@machine-co.dev'}
          aria-invalid={state === 'invalid' || undefined}
          disabled={state === 'disabled'}
        />
        {state === 'invalid' ? (
          <FieldError>Enter an email like agent@machine-co.dev.</FieldError>
        ) : (
          <FieldDescription>The agent signs commits with this address.</FieldDescription>
        )}
      </Field>
    ),
  },
  // ---- Data display ----
  {
    key: 'avatar',
    name: 'Avatar',
    group: 'Data display',
    axes: { size: ['sm', 'md', 'lg'] },
    render: ({ size }) => (
      <Avatar className={size === 'sm' ? 'size-6' : size === 'lg' ? 'size-10' : undefined}>
        <AvatarFallback>RH</AvatarFallback>
      </Avatar>
    ),
  },
  {
    key: 'kbd',
    name: 'Kbd',
    group: 'Data display',
    axes: { content: ['symbol', 'letter', 'word'] },
    render: ({ content }) => <Kbd>{content === 'symbol' ? '⌘' : content === 'letter' ? 'K' : 'Esc'}</Kbd>,
  },
  {
    key: 'separator',
    name: 'Separator',
    group: 'Layout',
    axes: { orientation: ['horizontal', 'vertical'] },
    width: 320,
    render: ({ orientation }) => (
      <Separator orientation={orientation as 'horizontal' | 'vertical'} className={orientation === 'vertical' ? 'h-6' : undefined} />
    ),
  },
  {
    key: 'table',
    name: 'Table',
    group: 'Data display',
    axes: { footer: ['false', 'true'] },
    width: 560,
    render: ({ footer }) => (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Run</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Trigger</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {RUNS.map(([id, status, trigger, duration]) => (
            <TableRow key={id}>
              <TableCell className="font-medium">{id}</TableCell>
              <TableCell>
                <Badge variant={status === 'Failed' ? 'destructive' : 'secondary'}>{status}</Badge>
              </TableCell>
              <TableCell>{trigger}</TableCell>
              <TableCell className="text-right tabular-nums">{duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {footer === 'true' && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right tabular-nums">12m 00s</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    ),
  },
  {
    key: 'status-dot',
    name: 'Status Dot',
    group: 'Data display',
    axes: { tone: ['online', 'busy', 'error', 'offline', 'accent'], pulse: ['false', 'true'] },
    render: ({ tone, pulse }) => <StatusDot tone={tone as StatusTone} pulse={pulse === 'true'} />,
  },
  // ---- Navigation ----
  {
    key: 'tabs',
    name: 'Tabs',
    group: 'Navigation',
    axes: { active: ['overview', 'activity', 'settings'] },
    width: 448,
    render: ({ active }) => (
      <Tabs value={active}>
        <TabsList>
          {TABS.map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(([value, , body]) => (
          <TabsContent key={value} value={value} className="text-sm text-muted-foreground">
            {body}
          </TabsContent>
        ))}
      </Tabs>
    ),
  },
  {
    key: 'breadcrumb',
    name: 'Breadcrumb',
    group: 'Navigation',
    axes: { collapsed: ['false', 'true'] },
    render: ({ collapsed }) => (
      <Breadcrumb className="w-fit">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#home">machine-co</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{collapsed === 'true' ? <BreadcrumbEllipsis /> : <BreadcrumbLink href="#repo">middle-out</BreadcrumbLink>}</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#pulls">Pull requests</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Fix flaky upload test</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  },
  // ---- Feedback ----
  {
    key: 'progress',
    name: 'Progress',
    group: 'Feedback',
    axes: { value: ['0', '25', '60', '100'] },
    width: 320,
    render: ({ value }) => <Progress aria-label="Indexing the repository" value={Number(value)} />,
  },
  {
    key: 'skeleton',
    name: 'Skeleton',
    group: 'Feedback',
    axes: { shape: ['line', 'circle', 'block'] },
    render: ({ shape }) => <Skeleton className={shape === 'circle' ? 'size-12 rounded-full' : shape === 'line' ? 'h-4 w-64' : 'h-24 w-64'} />,
  },
  {
    key: 'empty',
    name: 'Empty',
    group: 'Feedback',
    axes: { actions: ['true', 'false'] },
    width: 448,
    render: ({ actions }) => (
      <Empty>
        <EmptyMedia>
          <SquareTerminal aria-hidden />
        </EmptyMedia>
        <EmptyTitle>No sessions yet</EmptyTitle>
        <EmptyDescription>Start a session and the agent can fix a bug, write tests, or review a pull request.</EmptyDescription>
        {actions === 'true' && (
          <EmptyActions>
            <Button>New session</Button>
            <Button variant="ghost">Browse open issues</Button>
          </EmptyActions>
        )}
      </Empty>
    ),
  },
  // ---- AI elements ----
  {
    key: 'message',
    name: 'Message',
    group: 'AI elements',
    axes: { from: ['user', 'assistant'] },
    width: 560,
    render: ({ from }) =>
      from === 'user' ? (
        <Message from="user">
          <MessageContent>Why is the upload test failing on main?</MessageContent>
        </Message>
      ) : (
        <Message from="assistant">
          <AgentGlyph className="size-7" />
          <MessageContent>
            <p>
              It started with #477, which put chunked uploads behind a flag. The test still sends a 3 GB file in one request, and the
              server now turns down anything over 2 GB.
            </p>
            <p>I’d turn the flag on in the test. Want me to open a pull request?</p>
          </MessageContent>
        </Message>
      ),
  },
  {
    key: 'tool-call',
    name: 'Tool Call',
    group: 'AI elements',
    axes: { status: ['running', 'done', 'error'], open: ['false', 'true'] },
    width: 448,
    render: ({ status, open }) => (
      <ToolCall
        name={status === 'error' ? 'github.create_pull_request' : 'bash'}
        status={status as ToolStatus}
        input={status === 'error' ? undefined : 'pnpm test e2e/upload.spec.ts'}
        output={status === 'done' ? '12 passed, 1 failed' : status === 'error' ? '403: token lacks write access to hooli/nucleus' : undefined}
        defaultOpen={open === 'true'}
      />
    ),
  },
  {
    key: 'thinking-indicator',
    name: 'Thinking Indicator',
    group: 'AI elements',
    axes: { label: ['default', 'custom'] },
    render: ({ label }) => <ThinkingIndicator label={label === 'custom' ? 'Reading 14 files' : undefined} />,
  },
  {
    key: 'citation',
    name: 'Citation',
    group: 'AI elements',
    axes: { index: ['1', '12'] },
    render: ({ index }) => <Citation index={Number(index)} source={SOURCES[0]!} />,
  },
  {
    key: 'sources',
    name: 'Sources',
    group: 'AI elements',
    axes: { count: ['1', '3'] },
    width: 448,
    render: ({ count }) => <Sources sources={SOURCES.slice(0, Number(count))} />,
  },
  {
    key: 'code-block',
    name: 'Code Block',
    group: 'AI elements',
    axes: { header: ['filename', 'language'] },
    width: 560,
    render: ({ header }) => (
      <CodeBlock code={CODE_SNIPPET} filename={header === 'filename' ? 'theme.ts' : undefined} language={header === 'language' ? 'typescript' : undefined} />
    ),
  },
  {
    key: 'prompt-input',
    name: 'Prompt Input',
    group: 'AI elements',
    axes: { busy: ['false', 'true'], tools: ['false', 'true'] },
    width: 560,
    render: ({ busy, tools }) => (
      <PromptInput
        busy={busy === 'true'}
        placeholder={busy === 'true' ? 'The agent is working…' : 'Ask the agent to change something…'}
        hint="The agent can make mistakes. Review the diff before you merge."
        tools={
          tools === 'true' ? (
            <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
              <Paperclip aria-hidden /> Attach
            </Button>
          ) : undefined
        }
      />
    ),
  },
  {
    key: 'agent-glyph',
    name: 'Agent Glyph',
    group: 'AI elements',
    axes: { size: ['sm', 'md', 'lg'] },
    render: ({ size }) => <AgentGlyph className={size === 'sm' ? 'size-6' : size === 'lg' ? 'size-10' : undefined} />,
  },
  {
    key: 'native-select',
    name: 'Native Select',
    group: 'Forms',
    axes: { state: ['default', 'disabled'] },
    width: 288,
    render: ({ state }) => (
      <NativeSelect aria-label="Region" defaultValue="eu-west" disabled={state === 'disabled'}>
        <option value="us-east">US East (Virginia)</option>
        <option value="eu-west">EU West (Dublin)</option>
        <option value="ap-south">Asia Pacific (Sydney)</option>
      </NativeSelect>
    ),
  },
  {
    key: 'input-otp',
    name: 'Input OTP',
    group: 'Forms',
    axes: { state: ['empty', 'partial', 'filled'] },
    render: ({ state }) => (
      <InputOTP aria-label="Verification code" containerClassName="w-fit" maxLength={6} value={state === 'empty' ? '' : state === 'partial' ? '482' : '482913'} onChange={() => {}}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    ),
  },
  {
    key: 'stat',
    name: 'Stat',
    group: 'Data display',
    axes: { trend: ['up', 'down', 'none'] },
    width: 224,
    render: ({ trend }) =>
      trend === 'none' ? (
        <Stat label="Agent minutes" value="9,412" />
      ) : trend === 'up' ? (
        <Stat label="PRs merged" value="126" change="12.4%" trend="up" />
      ) : (
        <Stat label="Revert rate" value="2.1%" change="0.3pt" trend="down" />
      ),
  },
  {
    key: 'confidence-bar',
    name: 'Confidence Bar',
    group: 'AI elements',
    axes: { level: ['high', 'medium', 'low'] },
    width: 320,
    render: ({ level }) =>
      level === 'high' ? (
        <ConfidenceBar value={92} label="Root cause" />
      ) : level === 'medium' ? (
        <ConfidenceBar value={64} label="Fix covers every caller" />
      ) : (
        <ConfidenceBar value={31} label="Safe to auto-merge" />
      ),
  },
  {
    key: 'approval-card',
    name: 'Approval Card',
    group: 'AI elements',
    axes: { selected: ['default', 'rollback', 'ask'] },
    width: 448,
    render: ({ selected }) => (
      <ApprovalCard question="The migration fails on Hooli’s data. What should I do?" options={APPROVAL_OPTIONS} defaultValue={selected} />
    ),
  },
  {
    key: 'thinking-steps',
    name: 'Thinking Steps',
    group: 'AI elements',
    axes: { progress: ['started', 'halfway', 'done'] },
    width: 384,
    render: ({ progress }) => <ThinkingSteps steps={STEPS[progress ?? 'started']!} />,
  },
  {
    key: 'label',
    name: 'Label',
    group: 'Forms',
    axes: { state: ['default', 'disabled'] },
    render: ({ state }) => (
      <Label className={state === 'disabled' ? 'w-fit opacity-50' : 'w-fit'}>Repository</Label>
    ),
  },
  {
    key: 'typography',
    name: 'Typography',
    group: 'Data display',
    width: 480,
    axes: { style: ['h1', 'h2', 'h3', 'h4', 'p', 'lead', 'muted', 'inline-code'] },
    render: ({ style }) => {
      switch (style) {
        case 'h1':
          return <H1>Middle-out compression</H1>;
        case 'h2':
          return <H2>Weekly agent report</H2>;
        case 'h3':
          return <H3>Pull requests</H3>;
        case 'h4':
          return <H4>Failing checks</H4>;
        case 'lead':
          return <Lead>The agent fixes bugs, writes tests and reviews pull requests.</Lead>;
        case 'muted':
          return <Muted>Updated 4 minutes ago by the agent.</Muted>;
        case 'inline-code':
          return <InlineCode>pnpm test</InlineCode>;
        default:
          return <P>The agent opened 38 pull requests this week. 31 merged without changes.</P>;
      }
    },
  },
  {
    key: 'spinner',
    name: 'Spinner',
    group: 'Feedback',
    axes: { size: ['sm', 'md', 'lg'] },
    render: ({ size }) => <Spinner className={size === 'sm' ? 'size-3' : size === 'lg' ? 'size-6' : undefined} />,
  },
  {
    key: 'pagination',
    name: 'Pagination',
    group: 'Navigation',
    axes: { page: ['1', '2', '3'] },
    width: 448,
    render: ({ page }) => (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#previous" />
          </PaginationItem>
          {['1', '2', '3'].map((n) => (
            <PaginationItem key={n}>
              <PaginationLink href={`#page-${n}`} isActive={n === page}>
                {n}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#next" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
  },
];

/** Every combination of a spec's axes, minus the skipped ones. */
export function combinations(spec: FigmaSpec): Record<string, string>[] {
  let out: Record<string, string>[] = [{}];
  for (const [axis, values] of Object.entries(spec.axes)) {
    out = out.flatMap((combo) => values.map((value) => ({ ...combo, [axis]: value })));
  }
  return spec.skip ? out.filter((c) => !spec.skip!(c)) : out;
}
