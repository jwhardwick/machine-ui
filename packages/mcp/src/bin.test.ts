import { join } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { expect, it } from 'vitest';

it('starts over stdio and answers tool calls, as an MCP client would run it', { timeout: 30_000 }, async () => {
  const transport = new StdioClientTransport({ command: process.execPath, args: [join(import.meta.dirname, 'bin.ts')], stderr: 'pipe' });
  const client = new Client({ name: 'stdio-test', version: '1.0.0' });
  await client.connect(transport);
  try {
    const { tools } = await client.listTools();
    expect(tools).toHaveLength(4);
    const result = await client.callTool({ name: 'get_component', arguments: { slug: 'sidebar' } });
    expect((result.content as { text: string }[])[0]!.text).toContain('@machine-ui/sidebar');
  } finally {
    await client.close();
  }
});
