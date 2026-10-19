// Builds a structured report of a package's public API with the TypeScript compiler, so the
// version-bump tool can classify changes (removed export, removed or narrowed prop, ...).
import { join } from 'node:path';
import ts from 'typescript';

export interface ApiMember {
  type: string;
  optional: boolean;
}

export interface ApiExport {
  kind: 'function' | 'const' | 'type' | 'interface' | 'class' | 'enum' | 'other';
  signature: string;
  /** Props (for components and functions taking an object) or interface members, declared in our source. */
  members?: Record<string, ApiMember>;
}

export interface ApiReport {
  exports: Record<string, ApiExport>;
}

const FORMAT = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;

/** Declarations from our own packages, not node_modules or TypeScript's lib files. */
function isOwn(declaration: ts.Declaration): boolean {
  const file = declaration.getSourceFile().fileName;
  return !file.includes('/node_modules/') && !/\/typescript\/lib\//.test(file);
}

function membersOf(checker: ts.TypeChecker, type: ts.Type, at: ts.Node): Record<string, ApiMember> | undefined {
  const members: Record<string, ApiMember> = {};
  for (const property of checker.getPropertiesOfType(type)) {
    const declaration = property.valueDeclaration ?? property.declarations?.[0];
    if (!declaration || !isOwn(declaration)) continue;
    members[property.name] = {
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, at), at, FORMAT),
      optional: (property.flags & ts.SymbolFlags.Optional) !== 0,
    };
  }
  const sorted = Object.keys(members).sort((a, b) => a.localeCompare(b, 'en'));
  return sorted.length ? Object.fromEntries(sorted.map((k) => [k, members[k]!])) : undefined;
}

function describe(checker: ts.TypeChecker, symbol: ts.Symbol): ApiExport {
  const declaration = symbol.declarations?.[0];
  if (!declaration) return { kind: 'other', signature: '' };

  if (ts.isInterfaceDeclaration(declaration)) {
    const type = checker.getDeclaredTypeOfSymbol(symbol);
    const heritage = declaration.heritageClauses?.map((h) => h.getText()).join(' ') ?? '';
    return { kind: 'interface', signature: heritage, members: membersOf(checker, type, declaration) };
  }
  if (ts.isTypeAliasDeclaration(declaration)) {
    const type = checker.getDeclaredTypeOfSymbol(symbol);
    const signature = checker.typeToString(type, declaration, FORMAT | ts.TypeFormatFlags.InTypeAlias);
    return { kind: 'type', signature, members: type.isUnion() ? undefined : membersOf(checker, type, declaration) };
  }
  if (ts.isClassDeclaration(declaration)) {
    return { kind: 'class', signature: declaration.heritageClauses?.map((h) => h.getText()).join(' ') ?? '' };
  }
  if (ts.isEnumDeclaration(declaration)) {
    return { kind: 'enum', signature: declaration.members.map((m) => m.name.getText()).join(', ') };
  }

  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  if (ts.isFunctionDeclaration(declaration)) {
    const signatures = type.getCallSignatures();
    const signature = signatures.map((s) => checker.signatureToString(s, declaration, FORMAT)).join('\n');
    const first = signatures[0]?.getParameters()[0];
    const members = first ? membersOf(checker, checker.getTypeOfSymbolAtLocation(first, declaration), declaration) : undefined;
    return { kind: 'function', signature, ...(members ? { members } : {}) };
  }
  return { kind: 'const', signature: checker.typeToString(type, declaration, FORMAT) };
}

/** Report the public API of the package in `packageDir` (entry: `src/index.ts`). */
export function apiReport(packageDir: string): ApiReport {
  const configPath = join(packageDir, 'tsconfig.json');
  const parsed = ts.getParsedCommandLineOfConfigFile(configPath, {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
  if (!parsed) throw new Error(`Could not read ${configPath}`);
  const entry = join(packageDir, 'src/index.ts');
  const program = ts.createProgram({ rootNames: [entry], options: { ...parsed.options, noEmit: true } });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(entry);
  const moduleSymbol = source && checker.getSymbolAtLocation(source);
  if (!moduleSymbol) throw new Error(`No module symbol for ${entry}`);

  const entries = checker.getExportsOfModule(moduleSymbol).map((exported) => {
    const target = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    return [exported.name, describe(checker, target)] as const;
  });
  entries.sort(([a], [b]) => a.localeCompare(b, 'en'));
  return { exports: Object.fromEntries(entries) };
}
