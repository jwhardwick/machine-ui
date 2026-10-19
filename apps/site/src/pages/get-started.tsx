import { CodeBlock } from '@machine-ui/ui';
import { fontsLink, installPrompt, registryEntry } from '../site/install-prompt.ts';
import { useSiteTheme } from '../site/theme.tsx';

export function GetStartedPage() {
  const { seed } = useSiteTheme();
  const origin = window.location.origin;
  const steps = [
    {
      title: 'Add the registry',
      body: 'machine-ui installs as source through the shadcn CLI. Point your project at this registry (run `npx shadcn@latest init` first if you have no components.json).',
      file: 'components.json',
      code: registryEntry(origin),
    },
    {
      title: 'Install your theme',
      body: `This is the theme you’re looking at now (${seed.name}). It brings the token mapping, base styles and animations with it. Change it on the Themes page.`,
      file: 'terminal',
      code: `npx shadcn@latest add @machine-ui/theme-${seed.name}`,
    },
    {
      title: 'Load the fonts',
      body: 'Each theme names its typefaces; load them however your framework prefers. Fallback stacks keep things readable if they don’t load.',
      file: 'index.html',
      code: fontsLink(seed),
    },
    {
      title: 'Add components',
      body: 'Every component page shows its install command. Files land in your project, so you own them.',
      file: 'terminal',
      code: 'npx shadcn@latest add @machine-ui/button @machine-ui/card @machine-ui/sidebar',
    },
  ];

  return (
    <article className="grid max-w-3xl grid-cols-1 gap-10">
      <header className="grid grid-cols-1 gap-4">
        <h1 className="font-display text-4xl font-semibold">Get started</h1>
        <p className="text-lg text-muted-foreground">Add machine-ui to a React and Tailwind v4 project in four steps, by hand or with your coding agent.</p>
      </header>
      <ol className="grid grid-cols-1 gap-8">
        {steps.map((step, i) => (
          <li key={step.title} className="grid grid-cols-1 gap-3 sm:grid-cols-[2.5rem_1fr]">
            <span className="flex size-8 items-center justify-center rounded-full border font-mono text-sm" aria-hidden>
              {i + 1}
            </span>
            <div className="grid min-w-0 grid-cols-1 gap-3">
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
        <p className="text-muted-foreground">
          Paste this into Claude Code, Cursor or any agent. It adds the registry, installs your current theme and sets the styling rules. Agents can also read{' '}
          <a href="/llms.txt" className="text-link underline underline-offset-4">
            llms.txt
          </a>
          .
        </p>
        <CodeBlock filename="install prompt" code={installPrompt(seed, origin)} />
      </section>
    </article>
  );
}
