#!/usr/bin/env node
// PreToolUse(Edit|Write|MultiEdit|NotebookEdit): refuse edits to files only humans may change.
import { block, protectedReason, readInput } from './policy.mjs';

const input = await readInput();
const path = String(input.tool_input?.file_path ?? input.tool_input?.notebook_path ?? '');
const reason = protectedReason(path);
if (reason) block(`${path}: ${reason}.`);
process.exit(0);
