import { generateTheme } from '@machine-ui/theme-engine';
import { COLOR_ROLES, REFERENCE_THEMES } from '@machine-ui/tokens';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { createServer } from './server.ts';

let client: Client;

beforeAll(async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await createServer().connect(serverTransport);
  client = new Client({ name: 'test', version: '1.0.0' });
  await client.connect(clientTransport);
});

const call = async (name: string, args: Record<string, unknown> = {}) => {
  const result = await client.callTool({ name, arguments: args });
  const text = (result.content as { type: string; text: string }[]).map((c) => c.text).join('\n');
  return { text, isError: Boolean(result.isError), json: () => JSON.parse(text) };
};

describe('machine-ui MCP server', () => {
  it('offers the four tools from the spec, each described', async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(['generate_theme', 'get_component', 'get_tokens', 'list_components']);
    for (const tool of tools) expect(tool.description!.length, tool.name).toBeGreaterThan(30);
  });

  it('list_components returns every component, and filters by category', async () => {
    const all = (await call('list_components')).json();
    expect(all.length).toBeGreaterThan(70);
    expect(all[0]).toEqual(expect.objectContaining({ slug: expect.any(String), name: expect.any(String), install: expect.any(String) }));
    const ai = (await call('list_components', { category: 'ai' })).json();
    expect(ai.length).toBeGreaterThan(5);
    expect(ai.every((c: { category: string }) => c.category === 'ai')).toBe(true);
  });

  it('get_component returns install, props and example code', async () => {
    const { text } = await call('get_component', { slug: 'button' });
    expect(text).toContain('npx shadcn@latest add @machine-ui/button');
    expect(text).toMatch(/variant\?/);
    expect(text).toContain("from '@machine-ui/ui'");
    expect((await call('get_component', { slug: 'toast' })).text).toContain('@machine-ui/sonner');
  });

  it('get_component explains an unknown slug and suggests close matches', async () => {
    const { isError, text } = await call('get_component', { slug: 'buton' });
    expect(isError).toBe(true);
    expect(text).toContain('button');
  });

  it('get_tokens lists the contract, and a preset’s values', async () => {
    const contract = (await call('get_tokens')).json();
    expect(contract.colorRoles).toEqual([...COLOR_ROLES]);
    expect(contract.presets).toContain('console');
    const forge = (await call('get_tokens', { preset: 'forge' })).json();
    expect(forge.light.primary).toBe(generateTheme(REFERENCE_THEMES.find((t) => t.name === 'forge')!).light.primary);
  });

  it('generate_theme turns a partial seed into CSS, a share link, a brief and a contrast audit', async () => {
    const result = (await call('generate_theme', { name: 'calm-editorial', hue: 210, chroma: 0.3, neutral: 'warm', typePair: 'editorial' })).json();
    expect(result.seed).toMatchObject({ name: 'calm-editorial', hue: 210, typePair: 'editorial', motion: 'subtle' });
    expect(result.css).toContain(':root {');
    expect(result.share).toMatch(/^icalm-editorial_h210_/);
    expect(result.brief).toContain('# Theme brief: calm-editorial');
    expect(result.contrast).toEqual({ passed: result.contrast.total, total: expect.any(Number) });
  });

  it('generate_theme rejects invalid input with a clear error', async () => {
    const { isError, text } = await call('generate_theme', { hue: 'teal' });
    expect(isError).toBe(true);
    expect(text).toMatch(/hue/);
  });
});
