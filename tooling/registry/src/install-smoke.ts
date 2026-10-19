// pnpm test:registry-install — end-to-end proof that the registry installs into a fresh shadcn
// project and the result typechecks and builds. Needs network (npm and shadcn's own registry), so
// it is opt-in rather than part of `pnpm check`.
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { OUT_DIR } from './build.ts';

const ITEMS = ['theme-console', 'date-picker', 'sidebar', 'data-table', 'command', 'prompt-input', 'chart', 'carousel', 'input-otp', 'sonner'];
const PORT = 4181;

const server = createServer(async (req, res) => {
  let body: Buffer;
  try {
    body = await readFile(join(OUT_DIR, decodeURIComponent((req.url ?? '').replace(/^\/r\//, ''))));
  } catch {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': 'application/json' }).end(body);
});
await new Promise<void>((resolve) => server.listen(PORT, resolve));

const dir = mkdtempSync(join(tmpdir(), 'machine-ui-registry-'));
const write = (path: string, content: unknown) => writeFileSync(join(dir, path), typeof content === 'string' ? content : JSON.stringify(content, null, 2));
// Async on purpose: the registry server lives in this process, so blocking here would deadlock it.
const run = (cmd: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    spawn(cmd, args, { cwd: dir, stdio: 'inherit' }).on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`)),
    );
  });

try {
  execFileSync('mkdir', ['-p', join(dir, 'src')]);
  write('package.json', {
    name: 'registry-smoke',
    private: true,
    type: 'module',
    dependencies: { react: '19.3.1', 'react-dom': '19.3.1' },
    devDependencies: { '@tailwindcss/vite': '4.3.3', '@types/react': '19.3.0', '@types/react-dom': '19.3.0', '@vitejs/plugin-react': '6.1.2', tailwindcss: '4.3.3', typescript: '6.0.3', vite: '8.3.4' },
  });
  write('tsconfig.json', {
    compilerOptions: { target: 'ES2023', lib: ['ES2023', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, types: ['vite/client'], noEmit: true, paths: { '@/*': ['./src/*'] } },
    include: ['src'],
  });
  write('vite.config.ts', `import tailwindcss from '@tailwindcss/vite';\nimport react from '@vitejs/plugin-react';\nimport { fileURLToPath } from 'node:url';\nimport { defineConfig } from 'vite';\nexport default defineConfig({ plugins: [react(), tailwindcss()], resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } } });\n`);
  write('index.html', '<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n');
  write('src/index.css', '@import "tailwindcss";\n');
  write('components.json', {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: 'new-york',
    rsc: false,
    tsx: true,
    tailwind: { config: '', css: 'src/index.css', baseColor: 'neutral', cssVariables: true, prefix: '' },
    iconLibrary: 'lucide',
    aliases: { components: '@/components', utils: '@/lib/utils', ui: '@/components/ui', lib: '@/lib', hooks: '@/hooks' },
    registries: { '@machine-ui': `http://localhost:${PORT}/r/{name}.json` },
  });
  write('src/main.tsx', `import { createRoot } from 'react-dom/client';\nimport { DatePicker } from '@/components/ui/date-picker';\nimport { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';\nimport './index.css';\ncreateRoot(document.getElementById('root')!).render(<SidebarProvider><Sidebar><SidebarContent>Nav</SidebarContent></Sidebar><SidebarInset><DatePicker aria-label="Date" /></SidebarInset></SidebarProvider>);\n`);

  await run('npm', ['install', '--silent']);
  await run('npx', ['-y', 'shadcn@4.22.1', 'add', ...ITEMS.map((i) => `@machine-ui/${i}`), '-y', '-o']);
  await run('npx', ['tsc', '--noEmit', '-p', '.']);
  await run('npx', ['vite', 'build', '--logLevel', 'warn']);
  console.log(`\n✓ ${ITEMS.length} registry items installed, typechecked and built in ${dir}`);
} finally {
  server.close();
}
