// MCP server: lets any agent list and read machine-ui components, read the token contract and
// generate contrast-safe themes, without scraping the docs site.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { auditPalette, buildPalette, exportTheme, generateTheme, normalizeSeed, serializeSeed } from '@machine-ui/theme-engine';
import {
  COLOR_ROLES,
  MODE_TOKENS,
  MOTION_LEVELS,
  NEUTRAL_TEMPERATURES,
  REFERENCE_THEMES,
  SEED_LIMITS,
  SHARED_TOKENS,
  TYPE_PAIR_IDS,
} from '@machine-ui/tokens';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

interface ComponentData {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  install: string[];
  props: Record<string, Record<string, { type: string; optional: boolean }>>;
  example: string;
}

const COMPONENTS: ComponentData[] = JSON.parse(readFileSync(join(import.meta.dirname, '../data/components.json'), 'utf8'));
const CATEGORY_IDS = [...new Set(COMPONENTS.map((c) => c.category))] as [string, ...string[]];

const installCommand = (component: ComponentData) => `npx shadcn@latest add ${component.install.join(' ')}`;
const text = (value: string) => ({ content: [{ type: 'text' as const, text: value }] });
const json = (value: unknown) => text(JSON.stringify(value, null, 2));

/** Edit distance, to suggest the slug someone probably meant. */
function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length]!;
}

const range = (key: keyof typeof SEED_LIMITS) => z.number().min(SEED_LIMITS[key][0]).max(SEED_LIMITS[key][1]);

export function createServer(): McpServer {
  const server = new McpServer({ name: 'machine-ui', version: '0.1.0' });

  server.registerTool(
    'list_components',
    {
      title: 'List components',
      description: 'List machine-ui components with a one-line description and the shadcn command that installs each. Optionally filter by category.',
      inputSchema: { category: z.enum(CATEGORY_IDS).optional().describe('Only components in this category') },
    },
    async ({ category }) =>
      json(
        COMPONENTS.filter((c) => !category || c.category === category).map((c) => ({
          slug: c.slug,
          name: c.name,
          category: c.category,
          description: c.description,
          install: installCommand(c),
        })),
      ),
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get component',
      description: 'Everything needed to use one machine-ui component: description, install command, props of each part, and example code.',
      inputSchema: { slug: z.string().describe('Component slug from list_components, e.g. "data-table"') },
    },
    async ({ slug }) => {
      const component = COMPONENTS.find((c) => c.slug === slug);
      if (!component) {
        const suggestions = [...COMPONENTS]
          .sort((a, b) => distance(slug, a.slug) - distance(slug, b.slug))
          .slice(0, 3)
          .map((c) => c.slug);
        return { ...text(`No component "${slug}". Did you mean: ${suggestions.join(', ')}? Use list_components for all slugs.`), isError: true };
      }
      const props = Object.entries(component.props).map(
        ([part, members]) =>
          `### ${part}\n${Object.entries(members)
            .map(([name, m]) => `- \`${name}${m.optional ? '?' : ''}\`: ${m.type.replace(/ \| undefined$/, '')}`)
            .join('\n')}`,
      );
      return text(
        [
          `# ${component.name}`,
          component.description,
          `Install: \`${installCommand(component)}\``,
          ...(props.length ? ['## Props', ...props] : []),
          '## Example',
          '```tsx',
          component.example,
          '```',
        ].join('\n\n'),
      );
    },
  );

  server.registerTool(
    'get_tokens',
    {
      title: 'Get tokens',
      description: 'The token contract (colour roles, shared and per-mode tokens, presets). With a preset, also its exact light and dark values.',
      inputSchema: { preset: z.enum(REFERENCE_THEMES.map((t) => t.name) as [string, ...string[]]).optional() },
    },
    async ({ preset }) => {
      const contract = {
        colorRoles: [...COLOR_ROLES],
        sharedTokens: [...SHARED_TOKENS],
        modeTokens: [...MODE_TOKENS],
        presets: REFERENCE_THEMES.map((t) => t.name),
        usage: 'Tokens are CSS variables (var(--primary)) mapped to Tailwind utilities (bg-primary, text-primary-foreground).',
      };
      if (!preset) return json(contract);
      const tokens = generateTheme(REFERENCE_THEMES.find((t) => t.name === preset)!);
      return json({ ...contract, seed: tokens.seed, shared: tokens.shared, light: tokens.light, dark: tokens.dark });
    },
  );

  server.registerTool(
    'generate_theme',
    {
      title: 'Generate theme',
      description:
        'Turn a seed (any subset of hue, chroma, neutral, radius, density, separation, typePair, typeRatio, motion) into a contrast-safe theme: CSS for :root and .dark, a share string, an agent brief and a contrast audit.',
      inputSchema: {
        name: z.string().max(40).optional(),
        hue: range('hue').optional(),
        chroma: range('chroma').optional(),
        neutral: z.enum(NEUTRAL_TEMPERATURES).optional(),
        radius: range('radius').optional(),
        density: range('density').optional(),
        separation: range('separation').optional(),
        typePair: z.enum(TYPE_PAIR_IDS as [string, ...string[]]).optional(),
        typeRatio: range('typeRatio').optional(),
        motion: z.enum(MOTION_LEVELS).optional(),
      },
    },
    async (args) => {
      const seed = normalizeSeed(args as Parameters<typeof normalizeSeed>[0]);
      const { css, brief } = exportTheme(seed);
      const results = (['light', 'dark'] as const).flatMap((mode) => auditPalette(buildPalette(seed, mode)));
      return json({
        seed,
        share: serializeSeed(seed),
        css,
        brief,
        contrast: { passed: results.filter((r) => r.pass).length, total: results.length },
      });
    },
  );

  return server;
}
