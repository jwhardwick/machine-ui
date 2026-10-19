// Classifies API and token changes into semver levels, following the spec's bump table.
// The tool decides the level; an agent only explains it.
import type { ApiExport, ApiMember, ApiReport } from './api-report.ts';
import type { TokenReport } from './token-report.ts';

export type Level = 'major' | 'minor' | 'patch';
export interface Change {
  level: Level;
  reason: string;
}

const ORDER: Record<Level | 'none', number> = { none: 0, patch: 1, minor: 2, major: 3 };

export function highest(changes: Change[]): Level | 'none' {
  return changes.reduce<Level | 'none'>((top, c) => (ORDER[c.level] > ORDER[top] ? c.level : top), 'none');
}

/** Split a type string on top-level `|`, ignoring pipes inside brackets, generics or string literals. */
export function unionMembers(type: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let current = '';
  for (const char of type) {
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === '"' || char === "'" || char === '`') quote = char;
    else if ('([{<'.includes(char)) depth++;
    else if (')]}>'.includes(char)) depth--;
    else if (char === '|' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  parts.push(current.trim());
  return parts.filter(Boolean);
}

/** Compare two types as sets of union members. */
function compareTypes(before: string, after: string): { added: string[]; removed: string[] } {
  const strip = (t: string) => new Set(unionMembers(t).filter((m) => m !== 'undefined'));
  const a = strip(before);
  const b = strip(after);
  return { added: [...b].filter((m) => !a.has(m)), removed: [...a].filter((m) => !b.has(m)) };
}

function typeChange(subject: string, before: string, after: string): Change | null {
  const { added, removed } = compareTypes(before, after);
  if (!added.length && !removed.length) return null;
  const isUnionEdit = unionMembers(before).length > 1 || unionMembers(after).length > 1;
  if (isUnionEdit && !removed.length) return { level: 'minor', reason: `${subject} accepts ${added.join(', ')}` };
  if (isUnionEdit && !added.length) return { level: 'major', reason: `${subject} no longer accepts ${removed.join(', ')}` };
  return { level: 'major', reason: `${subject} type changed from ${before} to ${after}` };
}

function compareMembers(name: string, label: string, before: Record<string, ApiMember>, after: Record<string, ApiMember>): Change[] {
  const changes: Change[] = [];
  for (const [prop, old] of Object.entries(before)) {
    const next = after[prop];
    const subject = `${name}: ${label} "${prop}"`;
    if (!next) {
      changes.push({ level: 'major', reason: `${subject} removed` });
      continue;
    }
    if (old.optional && !next.optional) changes.push({ level: 'major', reason: `${subject} is now required` });
    if (!old.optional && next.optional) changes.push({ level: 'minor', reason: `${subject} is now optional` });
    const change = typeChange(subject, old.type, next.type);
    if (change) changes.push(change);
  }
  for (const [prop, next] of Object.entries(after)) {
    if (before[prop]) continue;
    changes.push(
      next.optional
        ? { level: 'minor', reason: `${name}: new optional ${label} "${prop}"` }
        : { level: 'major', reason: `${name}: new required ${label} "${prop}"` },
    );
  }
  return changes;
}

function compareExport(name: string, before: ApiExport, after: ApiExport): Change[] {
  if (before.kind !== after.kind) return [{ level: 'major', reason: `${name}: changed from ${before.kind} to ${after.kind}` }];
  // With members on both sides they carry the contract; the signature text also includes
  // incidental detail like destructured parameter names.
  if (before.members && after.members) {
    return compareMembers(name, before.kind === 'function' ? 'prop' : 'member', before.members, after.members);
  }
  if (before.signature === after.signature) return [];
  const change = typeChange(name, before.signature, after.signature);
  return change ? [change] : [];
}

export function classifyApi(before: ApiReport, after: ApiReport): Change[] {
  const changes: Change[] = [];
  for (const [name, old] of Object.entries(before.exports)) {
    const next = after.exports[name];
    if (!next) changes.push({ level: 'major', reason: `${name}: export removed` });
    else changes.push(...compareExport(name, old, next));
  }
  for (const name of Object.keys(after.exports)) {
    if (!before.exports[name]) changes.push({ level: 'minor', reason: `${name}: new export` });
  }
  return changes;
}

const TOKEN_LISTS = {
  colorRoles: 'colour role',
  sharedTokens: 'shared token',
  modeTokens: 'mode token',
  typePairs: 'type pair',
} as const;

export function classifyTokens(before: TokenReport, after: TokenReport): Change[] {
  const changes: Change[] = [];
  for (const [key, label] of Object.entries(TOKEN_LISTS) as [keyof typeof TOKEN_LISTS, string][]) {
    const next = new Set(after[key]);
    const old = new Set(before[key]);
    for (const name of before[key]) if (!next.has(name)) changes.push({ level: 'major', reason: `${label} "${name}" removed` });
    for (const name of after[key]) if (!old.has(name)) changes.push({ level: 'minor', reason: `new ${label} "${name}"` });
  }
  for (const [name, seed] of Object.entries(before.presets)) {
    const next = after.presets[name];
    if (!next) changes.push({ level: 'major', reason: `preset "${name}" removed` });
    else if (JSON.stringify(seed) !== JSON.stringify(next)) changes.push({ level: 'patch', reason: `preset "${name}" values changed` });
  }
  for (const name of Object.keys(after.presets)) {
    if (!before.presets[name]) changes.push({ level: 'minor', reason: `new preset "${name}"` });
  }
  return changes;
}
