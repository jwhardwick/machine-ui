// pnpm eval:run --mode baseline|skills [--tasks a,b] [--out dir] [--dry-run]
// Gives each task to Claude Code in a fresh fixture project, with or without the consumer skills,
// then scores the generated pages. Live runs cost model usage; --dry-run shows what would run.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { compareRuns, scoreDirectory, type Score } from './score.ts';

interface Task {
  id: string;
  prompt: string;
}

const ROOT = join(import.meta.dirname, '../../..');
const TASKS: Task[] = JSON.parse(readFileSync(join(import.meta.dirname, '../tasks.json'), 'utf8'));

const { values } = parseArgs({
  options: {
    mode: { type: 'string' },
    tasks: { type: 'string' },
    out: { type: 'string' },
    'dry-run': { type: 'boolean' },
    compare: { type: 'string', multiple: true },
  },
});

/** The command for one task: the same prompt either way; skills mode adds the consumer plugin. */
export function commandFor(task: Task, mode: 'baseline' | 'skills'): string[] {
  const prompt = `${task.prompt} This project uses Tailwind CSS v4 and React. Do not ask questions; make reasonable choices.`;
  return ['claude', '-p', prompt, '--permission-mode', 'acceptEdits', ...(mode === 'skills' ? ['--plugin-dir', join(ROOT, 'consumer')] : [])];
}

async function main() {
  if (values.compare) {
    const [baselineFile, skillsFile] = values.compare;
    if (!baselineFile || !skillsFile) throw new Error('--compare needs two result files: baseline then skills');
    const load = (file: string) => JSON.parse(readFileSync(file, 'utf8')) as { score: Score };
    console.log(JSON.stringify(compareRuns(load(baselineFile).score, load(skillsFile).score), null, 2));
    return;
  }
  const mode = values.mode;
  if (mode !== 'baseline' && mode !== 'skills') throw new Error('--mode must be "baseline" or "skills"');
  const selected = values.tasks ? TASKS.filter((t) => values.tasks!.split(',').includes(t.id)) : TASKS;
  const out = values.out ?? mkdtempSync(join(tmpdir(), `machine-ui-eval-${mode}-`));

  for (const task of selected) {
    const project = join(out, task.id);
    const command = commandFor(task, mode);
    if (values['dry-run']) {
      console.log(`[${task.id}] in ${project}:\n  ${command.map((a) => JSON.stringify(a)).join(' ')}`);
      continue;
    }
    mkdirSync(project, { recursive: true });
    cpSync(join(import.meta.dirname, '../template'), project, { recursive: true });
    execFileSync(command[0]!, command.slice(1), { cwd: project, stdio: 'inherit' });
  }
  if (values['dry-run']) return;

  const pages = join(out, 'pages');
  mkdirSync(pages, { recursive: true });
  for (const task of selected) cpSync(join(out, task.id, 'src'), join(pages, task.id), { recursive: true });
  const score = await scoreDirectory(pages);
  const resultFile = join(out, `${mode}.json`);
  writeFileSync(resultFile, JSON.stringify({ mode, tasks: selected.map((t) => t.id), score }, null, 2));
  console.log(`${mode}: ${score.total} off-system styles across ${selected.length} tasks → ${resultFile}`);
}

if (import.meta.main) await main();
