import {
  AgentGlyph,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Citation,
  ConfidenceBar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Message,
  MessageActions,
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
  Sources,
  StreamingText,
  ThinkingIndicator,
  ThinkingSteps,
  ToolCall,
} from '@machine-ui/ui';
import { Copy, MoreHorizontal, Paperclip, Plus, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

const THREADS = [
  ['Acme outage follow-up', '2m'],
  ['Lumen Labs onboarding', '1h'],
  ['Fjord Health refund', '3h'],
  ['Release notes v2.14', 'Yesterday'],
  ['Brightline renewal risk', 'Yesterday'],
  ['Cobalt Dental SSO setup', 'Mon'],
] as const;

const SOURCES = [
  { title: 'Intercom thread #8812', url: 'https://app.intercom.example/t/8812', snippet: 'Sync stopped at 14:02 UTC for all Acme workspaces.' },
  { title: 'Changelog v2.14', url: 'https://northwind.example/changelog/2-14', snippet: 'The sync interval is now a server-side setting.' },
];

interface Turn {
  id: number;
  from: 'user' | 'assistant';
  text: string;
}

function ModelPicker() {
  return (
    <Select defaultValue="fast">
      <SelectTrigger size="sm" aria-label="Model" className="h-(--control-sm) border-transparent shadow-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fast">Alpha 4 · fast</SelectItem>
        <SelectItem value="deep">Alpha 4 · deep</SelectItem>
        <SelectItem value="mini">Alpha mini</SelectItem>
      </SelectContent>
    </Select>
  );
}

function AssistantActions() {
  return (
    <MessageActions>
      {[
        [Copy, 'Copy response'],
        [ThumbsUp, 'Good response'],
        [ThumbsDown, 'Bad response'],
      ].map(([Icon, label]) => {
        const I = Icon as typeof Copy;
        return (
          <Button key={label as string} variant="ghost" size="icon" className="size-7" aria-label={label as string}>
            <I aria-hidden />
          </Button>
        );
      })}
    </MessageActions>
  );
}

/** An agent inbox: thread list, a worked answer with sources and tools, and a live composer. */
export function ChatScreen() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);

  const ask = (text: string) => {
    const id = Date.now();
    setTurns((t) => [...t, { id, from: 'user', text }]);
    setBusy(true);
    window.setTimeout(() => {
      setTurns((t) => [
        ...t,
        {
          id: id + 1,
          from: 'assistant',
          text: `Here’s what I found for “${text}”. Two tickets are still open with Acme, both waiting on Thursday’s fix. I’ve drafted a holding reply you can review.`,
        },
      ]);
    }, 1200);
  };

  return (
    <SidebarProvider className="h-full">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <AgentGlyph className="size-6" label="Alpha" />
            <span className="font-display font-semibold group-data-[collapsible=icon]/sidebar:hidden">Alpha</span>
          </div>
          <div className="grid gap-2 group-data-[collapsible=icon]/sidebar:hidden">
            <SearchInput aria-label="Search threads" placeholder="Search threads" shortcut="⌘K" />
            <Button size="sm" className="w-full">
              <Plus aria-hidden /> New thread
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {THREADS.map(([title, when], i) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton isActive={i === 0} tooltip={title}>
                      <span className="flex-1 truncate">{title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground group-data-[collapsible=icon]/sidebar:hidden">{when}</span>
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
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
            <div className="grid text-xs leading-tight">
              <span className="font-medium">Sam Keller</span>
              <span className="text-muted-foreground">Support lead</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-0">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <h2 className="truncate text-sm font-medium">Acme outage follow-up</h2>
          <Badge variant="outline" className="hidden sm:inline-flex">
            3 sources
          </Badge>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Share2 aria-hidden /> Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-(--control-sm)" aria-label="Thread options">
                  <MoreHorizontal aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Rename thread</DropdownMenuItem>
                <DropdownMenuItem>Export as Markdown</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Delete thread</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto grid w-full max-w-2xl gap-6 px-4 py-6">
            <Message from="user">
              <MessageContent>What happened with Acme’s outage, and what should I tell them?</MessageContent>
            </Message>

            <Message from="assistant">
              <AgentGlyph className="size-7" label="Alpha" />
              <MessageContent className="gap-4">
                <ThinkingSteps
                  steps={[
                    { label: 'Read the Intercom thread', detail: 'ticket #8812', state: 'done' },
                    { label: 'Checked the changelog', detail: 'v2.13 – v2.14', state: 'done' },
                    { label: 'Pulled Acme’s account status', state: 'done' },
                  ]}
                />
                <ToolCall name="stripe.get_account" status="done" input={'{ "customer": "acme" }'} output={'{ "plan": "scale", "seats": 140 }'} />
                <p>
                  Acme’s sync stopped at 14:02 UTC on Tuesday
                  <Citation index={1} source={SOURCES[0]!} />, right after 2.14 moved the sync interval to a server setting
                  <Citation index={2} source={SOURCES[1]!} />. The fix ships Thursday. Until then, the help-centre workaround restores
                  sync in under a minute.
                </p>
                <ConfidenceBar value={88} label="Root cause" className="max-w-xs" />
                <Sources sources={SOURCES} />
                <AssistantActions />
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
                <ThinkingIndicator label="Reading Acme’s tickets" />
              </Message>
            )}
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-2xl shrink-0 gap-3 px-4 pb-4">
          {turns.length === 0 && (
            <PromptSuggestions suggestions={['Draft the workaround note', 'What else is open with Acme?']} onPick={ask} />
          )}
          <PromptInput
            label="Ask Alpha"
            placeholder="Ask Alpha about your inbox…"
            busy={busy}
            onSubmit={ask}
            onStop={() => setBusy(false)}
            tools={
              <>
                <Button type="button" variant="ghost" size="icon" className="size-(--control-sm) text-muted-foreground" aria-label="Attach file">
                  <Paperclip aria-hidden />
                </Button>
                <ModelPicker />
              </>
            }
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
