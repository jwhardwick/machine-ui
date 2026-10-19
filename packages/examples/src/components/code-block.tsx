import { CodeBlock } from '@machine-ui/ui';
import { defineDoc } from '../types.ts';

export default defineDoc({
  slug: 'code-block',
  name: 'Code Block',
  category: 'ai',
  description: 'Code with a filename header and a copy button, for agent output and docs.',
  examples: [
    {
      name: 'Default',
      wide: true,
      render: () => (
        <CodeBlock
          className="w-full max-w-xl"
          filename="theme.ts"
          code={`import { applyTheme } from '@machine-ui/theme-engine';

applyTheme({ name: 'harbor', hue: 195, chroma: 0.55, neutral: 'cool',
  radius: 0.25, density: 0.55, separation: 0.15,
  typePair: 'civic', typeRatio: 1.2, motion: 'subtle' });`}
        />
      ),
    },
  ],
});
