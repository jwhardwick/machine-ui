import {
  AgentGlyph,
  ApprovalCard,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  CodeBlock,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  InlineCode,
  Message,
  MessageContent,
  PromptInput,
  PromptSuggestions,
  SearchInput,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  StatusDot,
  StreamingText,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThinkingIndicator,
  ThinkingSteps,
  ToolCall,
} from '@machine-ui/ui';
import { FileCode2, GitBranch, GitPullRequest, MoreHorizontal, Paperclip, Plus } from 'lucide-react';
import { Fragment, useState, type ComponentProps } from 'react';

type Tone = NonNullable<ComponentProps<typeof StatusDot>['tone']>;

const SESSIONS: { title: string; status: string; tone: Tone }[] = [
  { title: 'Fix flaky Weissman score test', status: 'Running', tone: 'accent' },
  { title: 'Scale PiperNet past 10,000 phones', status: 'Review', tone: 'busy' },
  { title: 'Add video calls to PiperChat', status: 'Merged', tone: 'online' },
  { title: 'Stop Son of Anton deleting code', status: 'Failed', tone: 'error' },
  { title: 'Ship the Box appliance build', status: 'Merged', tone: 'online' },
];

const FILES = [
  { path: 'src/middle-out/compress.ts', added: 4, removed: 1 },
  { path: 'src/middle-out/encoder.ts', added: 6, removed: 2 },
  { path: 'test/weissman.spec.ts', added: 1, removed: 3 },
];

const CHECKS: { name: string; result: string; tone: Tone; pulse?: boolean }[] = [
  { name: 'Typecheck', result: 'Passed', tone: 'online' },
  { name: 'Lint', result: 'Passed', tone: 'online' },
  { name: 'Unit tests', result: '412 passed', tone: 'online' },
  { name: 'weissman.spec.ts ×50', result: 'Running', tone: 'accent', pulse: true },
];

const DIFF = `@@ -38,8 +38,11 @@ export async function compress(input: ReadableStream) {
   for await (const block of blocks(input, BLOCK_SIZE)) {
     encoder.write(block);
   }
-  return encoder.result();
+  // Writing the last block isn't the end: the worker still
+  // has to flush it, or we score a partial file.
+  await encoder.flush({ timeout: 30_000 });
+  return encoder.result();
 }`;

const TERMINAL = `$ pnpm test test/weissman.spec.ts --repeat-each=50
Running 50 tests using 4 workers
  ✓ 50 passed (2.1m)
  Weissman score: 5.2 median, 5.1 lowest

$ pnpm typecheck && pnpm lint
✓ No problems found`;

// Like a model router: one picker, several providers, each model addressed as provider/model.
const MODELS = [
  { provider: 'machine-co', models: [['machine-co/machine-4', 'Machine 4'], ['machine-co/machine-4-mini', 'Machine 4 mini']] },
  { provider: 'Hooli', models: [['hooli/nucleus-3', 'Nucleus 3'], ['hooli/nucleus-3-flash', 'Nucleus 3 Flash']] },
  { provider: 'Pied Piper', models: [['pied-piper/middle-out-2', 'Middle-out 2'], ['pied-piper/middle-out-2-lite', 'Middle-out 2 Lite']] },
] as const;

interface Turn {
  id: number;
  from: 'user' | 'assistant';
  text: string;
}

function DiffStat({ added, removed }: { added: number; removed: number }) {
  return (
    <span className="shrink-0 font-mono text-xs tabular-nums">
      <span className="sr-only">
        {added} lines added, {removed} removed
      </span>
      <span aria-hidden>
        +{added} <span className="text-muted-foreground">−{removed}</span>
      </span>
    </span>
  );
}

function ComposerTools() {
  return (
    <>
      <Button type="button" variant="ghost" size="icon" className="size-(--control-sm) text-muted-foreground" aria-label="Attach file">
        <Paperclip aria-hidden />
      </Button>
      <Select defaultValue="machine-co/machine-4">
        <SelectTrigger size="sm" aria-label="Model" className="h-(--control-sm) border-transparent shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MODELS.map((group, i) => (
            <Fragment key={group.provider}>
              {i > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel>{group.provider}</SelectLabel>
                {group.models.map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </Fragment>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue="ask">
        <SelectTrigger size="sm" aria-label="Permissions" className="h-(--control-sm) border-transparent shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ask">Ask before edits</SelectItem>
          <SelectItem value="auto">Auto-accept edits</SelectItem>
          <SelectItem value="plan">Plan only</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}

/** The run's side panel: files changed, CI-style checks, and the agent's terminal. */
function ChangesPanel() {
  const added = FILES.reduce((n, f) => n + f.added, 0);
  const removed = FILES.reduce((n, f) => n + f.removed, 0);
  return (
    <aside aria-label="Changes" className="hidden w-96 shrink-0 flex-col border-l @4xl:flex">
      <Tabs defaultValue="changes" className="min-h-0 flex-1 gap-0">
        <div className="flex h-12 shrink-0 items-center border-b px-3">
          <TabsList>
            <TabsTrigger value="changes">Changes</TabsTrigger>
            <TabsTrigger value="checks">Checks</TabsTrigger>
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="changes" className="grid min-h-0 content-start gap-3 overflow-y-auto p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{FILES.length} files changed</span>
            <DiffStat added={added} removed={removed} />
          </div>
          <ul className="grid gap-1">
            {FILES.map((file) => (
              <li key={file.path} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                <FileCode2 aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate font-mono text-xs">{file.path}</span>
                <DiffStat added={file.added} removed={file.removed} />
              </li>
            ))}
          </ul>
          <CodeBlock filename="src/middle-out/compress.ts" code={DIFF} />
        </TabsContent>
        <TabsContent value="checks" className="min-h-0 overflow-y-auto p-3">
          <ul className="grid gap-1">
            {CHECKS.map((check) => (
              <li key={check.name} className="flex items-center gap-3 rounded-md px-2 py-2 text-sm">
                <StatusDot tone={check.tone} pulse={check.pulse} />
                <span className="flex-1">{check.name}</span>
                <span className="text-xs text-muted-foreground">{check.result}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="terminal" className="min-h-0 overflow-y-auto p-3">
          <CodeBlock filename="zsh" code={TERMINAL} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}

/** A coding agent at work. Sessions on the left, the current run in the middle, and the diff, checks, and terminal on the right. */
export function CodingAgentScreen() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [approval, setApproval] = useState<'pending' | 'draft' | 'push' | 'skipped'>('pending');

  const reply = (id: number, text: string, delay: number) => {
    setBusy(true);
    window.setTimeout(() => setTurns((t) => [...t, { id, from: 'assistant', text }]), delay);
  };

  const ask = (text: string) => {
    const id = Date.now();
    setTurns((t) => [...t, { id, from: 'user', text }]);
    reply(id + 1, `On it. I’ll keep working on fix/encoder-flush for “${text}” and run the Weissman benchmark again before I push.`, 1200);
  };

  const confirm = (value: string) => {
    setApproval(value === 'draft' ? 'draft' : 'push');
    reply(
      Date.now(),
      value === 'draft'
        ? 'Pushed fix/encoder-flush and opened draft PR #482. I’ll mark it ready once the 50-run check finishes.'
        : 'Pushed fix/encoder-flush. Open a PR from the header when you’re ready.',
      0,
    );
  };

  return (
    <SidebarProvider className="h-full">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <AgentGlyph className="size-6" label="Agent" />
            <span className="truncate font-display font-semibold group-data-[collapsible=icon]/sidebar:hidden">pied-piper/core</span>
          </div>
          <div className="grid gap-2 group-data-[collapsible=icon]/sidebar:hidden">
            <SearchInput aria-label="Search sessions" placeholder="Search sessions" shortcut="⌘K" />
            <Button size="sm" className="w-full">
              <Plus aria-hidden /> New session
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Sessions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SESSIONS.map((session, i) => (
                  <SidebarMenuItem key={session.title}>
                    <SidebarMenuButton isActive={i === 0} tooltip={`${session.title} · ${session.status}`}>
                      <StatusDot tone={session.tone} pulse={session.status === 'Running'} />
                      <span className="flex-1 truncate">{session.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground group-data-[collapsible=icon]/sidebar:hidden">{session.status}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]/sidebar:hidden">
            <Avatar className="size-7">
              <AvatarFallback>BG</AvatarFallback>
            </Avatar>
            <div className="grid text-xs leading-tight">
              <span className="font-medium">Bertram Gilfoyle</span>
              <span className="text-muted-foreground">Pied Piper</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <h2 className="truncate text-sm font-medium">Fix flaky Weissman score test</h2>
          <Badge variant="outline" className="hidden font-mono font-normal sm:inline-flex">
            <GitBranch aria-hidden className="size-3" /> fix/encoder-flush
          </Badge>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <GitPullRequest aria-hidden /> {approval === 'draft' ? 'PR #482' : 'Create PR'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-(--control-sm)" aria-label="Session options">
                  <MoreHorizontal aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Rename session</DropdownMenuItem>
                <DropdownMenuItem>Copy branch name</DropdownMenuItem>
                <DropdownMenuItem>Open in editor</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Discard changes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="@container flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto mask-b-from-[calc(100%-var(--spacing)*8)]">
              <div className="mx-auto grid w-full max-w-2xl gap-6 px-4 pt-6 pb-8">
                <Message from="user">
                  <MessageContent>weissman.spec.ts fails about one run in five on CI. Find out why and fix it.</MessageContent>
                </Message>

                <Message from="assistant">
                  <AgentGlyph className="size-7" label="Agent" />
                  <MessageContent className="gap-4">
                    <ThinkingSteps
                      steps={[
                        { label: 'Reproduced the flake', detail: '4 of 20 runs failed', state: 'done' },
                        { label: 'Traced it to an unflushed block', detail: 'src/middle-out/compress.ts:41', state: 'done' },
                        { label: 'Patched the encoder and re-ran', detail: '50 runs, 0 failures', state: 'done' },
                      ]}
                    />
                    <ToolCall
                      name="bash"
                      status="done"
                      input="pnpm test test/weissman.spec.ts --repeat-each=20"
                      output={'16 passed, 4 failed\nExpected Weissman score ≥ 5.0, received 2.9'}
                    />
                    <p>
                      <InlineCode>compress</InlineCode> returns as soon as the last block is written, but the worker still needs a moment to flush
                      it. When the test scores the output straight away, it sometimes measures a partial file, and the Weissman score
                      drops to <strong>2.9</strong>. Now <InlineCode>compress</InlineCode> waits for the flush, so every run scores the whole
                      file.
                    </p>
                    <ToolCall name="edit_file" status="done" input="src/middle-out/compress.ts" output={DIFF} />
                    {approval === 'pending' && (
                      <ApprovalCard
                        question="Push fix/encoder-flush?"
                        options={[
                          { value: 'draft', label: 'Push and open a draft PR', description: 'Ready for review once checks pass.' },
                          { value: 'push', label: 'Push only', description: 'You open the PR yourself.' },
                        ]}
                        onConfirm={confirm}
                        onSkip={() => setApproval('skipped')}
                      />
                    )}
                    {(approval === 'draft' || approval === 'push') && (
                      <ToolCall
                        name={approval === 'draft' ? 'gh pr create --draft' : 'git push'}
                        status="done"
                        output={approval === 'draft' ? 'https://github.com/pied-piper/core/pull/482' : 'fix/encoder-flush -> origin'}
                      />
                    )}
                  </MessageContent>
                </Message>

                {turns.map((turn) =>
                  turn.from === 'user' ? (
                    <Message key={turn.id} from="user">
                      <MessageContent>{turn.text}</MessageContent>
                    </Message>
                  ) : (
                    <Message key={turn.id} from="assistant">
                      <AgentGlyph className="size-7" label="Agent" />
                      <MessageContent>
                        <p>
                          <StreamingText text={turn.text} onDone={() => setBusy(false)} />
                        </p>
                      </MessageContent>
                    </Message>
                  ),
                )}
                {busy && turns.at(-1)?.from === 'user' && (
                  <Message from="assistant">
                    <AgentGlyph className="size-7" label="Agent" />
                    <ThinkingIndicator label="Reading the codebase" />
                  </Message>
                )}
              </div>
            </div>

            <div className="mx-auto grid w-full max-w-2xl shrink-0 gap-3 px-4 pb-4">
              {turns.length === 0 && (
                <PromptSuggestions suggestions={['Add a regression test', 'Why did the score drop to 2.9?']} onPick={ask} />
              )}
              <PromptInput
                label="Ask the agent"
                placeholder="Ask the agent to change something…"
                busy={busy}
                onSubmit={ask}
                onStop={() => setBusy(false)}
                tools={<ComposerTools />}
              />
            </div>
          </div>

          <ChangesPanel />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
