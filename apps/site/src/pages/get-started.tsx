import { CodeBlock } from '@machine-ui/ui';
import { fontsLink, installPrompt, registryEntry } from '../site/install-prompt.ts';
import { useSiteTheme } from '../site/theme.tsx';

export function GetStartedPage() {
  const { seed } = useSiteTheme();
  const origin = window.location.origin;
  const steps = [
    {
      title: 'Add the registry',
      body: 'machine-ui components install as source code through the shadcn CLI. Add this registry to your components.json. If you don’t have that file yet, run npx shadcn@latest init first.',
      file: 'components.json',
      code: registryEntry(origin),
    },
    {
      title: 'Install your theme',
      body: `This installs the theme you’re looking at now, ${seed.name}, along with the token mapping, base styles, and animations. To pick a different theme, go to the Themes page.`,
      file: 'terminal',
      code: `npx shadcn@latest add @machine-ui/theme-${seed.name}`,
    },
    {
      title: 'Load the fonts',
      body: 'Each theme uses its own fonts. Load them the way you usually load fonts in your framework. If they don’t load, text falls back to system fonts.',
      file: 'index.html',
      code: fontsLink(seed),
    },
    {
      title: 'Add components',
      body: 'Add components as you need them. Each component page has its install command. The files are copied into your project, so you can edit them.',
      file: 'terminal',
      code: 'npx shadcn@latest add @machine-ui/button @machine-ui/card @machine-ui/sidebar',
    },
  ];

  return (
    <article className="grid max-w-3xl grid-cols-1 gap-10">
      <header className="grid grid-cols-1 gap-4">
        <h1 className="font-display text-4xl font-semibold">Get started</h1>
        <p className="text-lg text-muted-foreground">Add machine-ui to a React and Tailwind v4 project in four steps. You can do it by hand or let your coding agent do it.</p>
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
          Paste this prompt into Claude Code, Cursor, or another coding agent. It adds the registry, installs your current theme, and
          tells the agent how to style things. For the full component list, agents can read{' '}
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
