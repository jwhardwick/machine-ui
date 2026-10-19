import { exportTheme } from '@machine-ui/theme-engine';
import type { ThemeSeed } from '@machine-ui/tokens';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@machine-ui/ui';
import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';

const FILES = [
  { value: 'css', label: 'theme.css', key: 'css' },
  { value: 'json', label: 'tokens.json', key: 'json' },
  { value: 'brief', label: 'theme-brief.md', key: 'brief' },
] as const;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      {copied ? 'Copied' : `Copy ${label}`}
    </Button>
  );
}

export function ExportPanel({ seed }: { seed: ThemeSeed }) {
  const files = useMemo(() => exportTheme(seed), [seed]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Take it with you</CardTitle>
        <CardDescription>
          Drop the CSS into any shadcn/ui project. Give the brief to your coding agent so it stays on-theme.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="css">
          <TabsList>
            {FILES.map((file) => (
              <TabsTrigger key={file.value} value={file.value}>
                {file.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {FILES.map((file) => (
            <TabsContent key={file.value} value={file.value} className="grid gap-3">
              <pre className="max-h-80 overflow-auto rounded-md border bg-muted p-4 font-mono text-xs text-foreground">
                {files[file.key]}
              </pre>
              <div>
                <CopyButton text={files[file.key]} label={file.label} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
