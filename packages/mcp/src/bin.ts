#!/usr/bin/env node
// Run the machine-ui MCP server over stdio: `node packages/mcp/src/bin.ts`.
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.ts';

await createServer().connect(new StdioServerTransport());
