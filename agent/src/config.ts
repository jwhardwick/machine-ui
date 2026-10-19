// The agent's per-repository settings. Teams start with everything review-required and loosen
// autonomy as trust builds; a major change always needs human approval.
import { parse } from 'yaml';
import { z } from 'zod';

const autonomyLevel = z.enum(['auto-merge', 'review', 'approval']);

export const configSchema = z.object({
  target: z.object({
    /** Package directories the agent maintains. */
    packages: z.array(z.string()).min(1, 'list at least one package directory'),
    storybook: z.string().optional(),
    site: z.string().optional(),
  }),
  issues: z
    .object({
      source: z.enum(['github', 'jira']).default('github'),
      readyLabel: z.string().default('agent:ready'),
      escalateLabel: z.string().default('needs-human'),
    })
    .default({ source: 'github', readyLabel: 'agent:ready', escalateLabel: 'needs-human' }),
  /** Hours to wait for objections to the plan comment before starting. */
  planWaitHours: z.number().min(0).max(72).default(2),
  /** Attempts at a failing gate before escalating. */
  retries: z.number().int().min(1).max(5).default(3),
  autonomy: z
    .object({
      patch: autonomyLevel.default('review'),
      minor: autonomyLevel.default('review'),
      major: z.literal('approval', { error: 'major changes always need human approval' }).default('approval'),
    })
    .default({ patch: 'review', minor: 'review', major: 'approval' }),
  /** Commands that must pass before a PR is opened. */
  gates: z.array(z.string()).default(['pnpm check']),
  referenceThemes: z.array(z.string()).optional(),
});

export type AgentConfig = z.infer<typeof configSchema>;

export function parseConfig(source: string): AgentConfig {
  let data: unknown;
  try {
    data = parse(source);
  } catch (error) {
    throw new Error(`Invalid YAML in config: ${(error as Error).message}`, { cause: error });
  }
  const result = configSchema.safeParse(data);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`);
    throw new Error(`Invalid agent config:\n  ${problems.join('\n  ')}`);
  }
  return result.data;
}
