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
  Message,
  MessageContent,
  PromptInput,
  PromptSuggestions,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
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
import { useState, type ComponentProps } from 'react';

type Tone = NonNullable<ComponentProps<typeof StatusDot>['tone']>;

const SESSIONS: { title: string; status: string; tone: Tone }[] = [
  { title: 'Fix flaky checkout test', status: 'Running', tone: 'accent' },
  { title: 'Add CSV export to orders', status: 'Review', tone: 'busy' },
  { title: 'Upgrade to React 19.2', status: 'Merged', tone: 'online' },
  { title: 'Migrate auth to passkeys', status: 'Failed', tone: 'error' },
  { title: 'Speed up product search', status: 'Merged', tone: 'online' },
];

const FILES = [
  { path: 'src/cart/use-cart.ts', added: 9, removed: 5 },
  { path: 'src/cart/cart-reducer.ts', added: 7, removed: 1 },
  { path: 'e2e/checkout.spec.ts', added: 2, removed: 0 },
];

const CHECKS: { name: string; result: string; tone: Tone; pulse?: boolean }[] = [
  { name: 'Typecheck', result: 'Passed', tone: 'online' },
  { name: 'Lint', result: 'Passed', tone: 'online' },
  { name: 'Unit tests', result: '412 passed', tone: 'online' },
  { name: 'checkout.spec.ts ×50', result: 'Running', tone: 'accent', pulse: true },
];

const DIFF = `@@ -38,11 +38,15 @@ export function useCart() {
-  const [total, setTotal] = useState(0);
-  useEffect(() => {
-    setTotal(sumLines(state.lines));
-  }, [state.lines]);
+  // The total is part of the cart state, so a click
+  // can never see lines and total out of step.
+  const { lines, total, pending } = state;

   const placeOrder = useCallback(async () => {
+    if (pending) await settled();
     return api.orders.create({ lines, total });
-  }, [lines, total]);
+  }, [lines, total, pending]);`;

const TERMINAL = `$ pnpm test e2e/checkout.spec.ts --repeat-each=50
Running 50 tests using 4 workers
  ✓ 50 passed (1.4m)

$ pnpm typecheck && pnpm lint
✓ No problems found`;

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
          <CodeBlock filename="src/cart/use-cart.ts" code={DIFF} />
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

/** A coding agent at work: sessions, a run with its plan, tool calls and an approval, and the diff it produced. */
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
    reply(id + 1, `On it. I’ll keep working on fix/checkout-race for “${text}” and run the checkout suite again before I push.`, 1200);
  };

  const confirm = (value: string) => {
    setApproval(value === 'draft' ? 'draft' : 'push');
    reply(
      Date.now(),
      value === 'draft'
        ? 'Pushed fix/checkout-race and opened draft PR #482. I’ll mark it ready once the 50-run check finishes.'
        : 'Pushed fix/checkout-race. Open a PR from the header when you’re ready.',
      0,
    );
  };

  return (
    <SidebarProvider className="h-full">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <AgentGlyph className="size-6" label="Alpha" />
            <span className="font-display font-semibold group-data-[collapsible=icon]/sidebar:hidden">northwind/web</span>
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
              <AvatarFallback>PO</AvatarFallback>
            </Avatar>
            <div className="grid text-xs leading-tight">
              <span className="font-medium">Priya Okafor</span>
              <span className="text-muted-foreground">Frontend</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <h2 className="truncate text-sm font-medium">Fix flaky checkout test</h2>
          <Badge variant="outline" className="hidden font-mono font-normal sm:inline-flex">
            <GitBranch aria-hidden className="size-3" /> fix/checkout-race
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
                  <MessageContent>checkout.spec.ts fails about one run in five on CI. Find out why and fix it.</MessageContent>
                </Message>

                <Message from="assistant">
                  <AgentGlyph className="size-7" label="Alpha" />
                  <MessageContent className="gap-4">
                    <ThinkingSteps
                      steps={[
                        { label: 'Reproduced the flake', detail: '4 of 20 runs failed', state: 'done' },
                        { label: 'Traced it to a stale total', detail: 'src/cart/use-cart.ts:41', state: 'done' },
                        { label: 'Patched the cart and re-ran', detail: '50 runs, 0 failures', state: 'done' },
                      ]}
                    />
                    <ToolCall
                      name="bash"
                      status="done"
                      input="pnpm test e2e/checkout.spec.ts --repeat-each=20"
                      output={'16 passed, 4 failed\nTimeout waiting for text "Order placed"'}
                    />
                    <p>
                      The cart total is recalculated in an effect, so a fast click on <strong>Place order</strong> can post the old
                      total. The server rejects the mismatch and the test times out. I moved the total into the reducer so it updates
                      with the lines, and the button now waits for any pending update.
                    </p>
                    <ToolCall name="edit_file" status="done" input="src/cart/use-cart.ts" output={DIFF} />
                    {approval === 'pending' && (
                      <ApprovalCard
                        question="Push fix/checkout-race?"
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
                        output={approval === 'draft' ? 'https://github.com/northwind/web/pull/482' : 'fix/checkout-race -> origin'}
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
                      <AgentGlyph className="size-7" label="Alpha" />
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
                    <AgentGlyph className="size-7" label="Alpha" />
                    <ThinkingIndicator label="Reading the codebase" />
                  </Message>
                )}
              </div>
            </div>

            <div className="mx-auto grid w-full max-w-2xl shrink-0 gap-3 px-4 pb-4">
              {turns.length === 0 && (
                <PromptSuggestions suggestions={['Add a regression test', 'Explain the race in more detail']} onPick={ask} />
              )}
              <PromptInput
                label="Ask Alpha"
                placeholder="Ask Alpha to change something…"
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
