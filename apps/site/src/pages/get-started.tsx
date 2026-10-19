import { Alert, AlertDescription, AlertTitle, CodeBlock } from '@machine-ui/ui';
import { Info } from 'lucide-react';
import { installPrompt } from '../site/install-prompt.ts';
import { useSiteTheme } from '../site/theme.tsx';
import { serializeSeed } from '@machine-ui/theme-engine';

const STEPS = [
  {
    title: 'Install the packages',
    body: 'The components, the theme engine and the token stylesheet.',
    file: 'terminal',
    code: 'npm i @machine-ui/ui @machine-ui/theme-engine @machine-ui/tokens',
  },
  {
    title: 'Import the stylesheet',
    body: 'One import brings Tailwind, the token mapping and the base styles.',
    file: 'globals.css',
    code: '@import "@machine-ui/ui/styles.css";',
  },
];

export function GetStartedPage() {
  const { seed } = useSiteTheme();
  return (
    <article className="grid grid-cols-1 max-w-3xl gap-10">
      <header className="grid grid-cols-1 gap-4">
        <h1 className="font-display text-4xl font-semibold">Get started</h1>
        <p className="text-lg text-muted-foreground">Add machine-ui to a React project in three steps, by hand or with your coding agent.</p>
      </header>
      <Alert>
        <Info aria-hidden />
        <AlertTitle>Pre-release</AlertTitle>
        <AlertDescription>The packages publish with the first release. Until then, the source is the workspace in this repository.</AlertDescription>
      </Alert>
      <ol className="grid grid-cols-1 gap-8">
        {[
          ...STEPS,
          {
            title: 'Apply your theme',
            body: 'Pass a seed at start-up. This one is the theme you’re looking at now; change it on the Themes page.',
            file: 'main.tsx',
            code: `import { applyTheme, parseSeed } from '@machine-ui/theme-engine';\n\napplyTheme(parseSeed('${serializeSeed(seed)}')!);`,
          },
        ].map((step, i) => (
          <li key={step.title} className="grid grid-cols-1 gap-3 sm:grid-cols-[2.5rem_1fr]">
            <span className="flex size-8 items-center justify-center rounded-full border font-mono text-sm" aria-hidden>
              {i + 1}
            </span>
            <div className="grid grid-cols-1 gap-3">
              <h2 className="text-lg font-medium">{step.title}</h2>
              <p className="text-muted-foreground">{step.body}</p>
              <CodeBlock filename={step.file} code={step.code} />
            </div>
          </li>
        ))}
      </ol>
      <section className="grid grid-cols-1 gap-3" aria-labelledby="agent">
        <h2 id="agent" className="font-display text-2xl font-semibold">
          With a coding agent
        </h2>
        <p className="text-muted-foreground">Paste this into Claude Code, Cursor or any agent. It installs the kit, applies your current theme and sets the styling rules.</p>
        <CodeBlock filename="install prompt" code={installPrompt(seed)} />
      </section>
    </article>
  );
}
