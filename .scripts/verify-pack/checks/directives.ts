import { parseSync } from '@babel/core';
import fg from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';

import { getRootPath } from '../../utils/getRootPath.ts';
import { type TargetPackage } from '../packages.ts';

import { walkFiles } from './staticChecks.ts';

const DIRECTIVE = 'use no memo';

// Same boundaries as .scripts/verify-compiler/index.ts: only shipped source counts.
const IGNORED_GLOBS = ['**/*.spec.*', '**/*.test.*', '**/test/**', '**/test-utils/**'];

const FUNCTION_TYPES = new Set([
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
  'ObjectMethod',
  'ClassMethod',
  'ClassPrivateMethod',
]);

// Keys that never contain child statements and would only slow the walk down.
const SKIPPED_KEYS = new Set(['loc', 'leadingComments', 'trailingComments', 'innerComments']);

// Structural AST node type: `@babel/types` is not a declared dependency under Yarn PnP,
// and this walker only ever reads `type` plus dynamically-accessed child keys.
type AnyNode = { type: string } & Record<string, unknown>;

function isNode(value: unknown): value is AnyNode {
  return typeof value === 'object' && value !== null && typeof (value as AnyNode).type === 'string';
}

function hasDirective(node: AnyNode): boolean {
  const body = node.body as AnyNode | undefined;

  if (body === undefined || body.type !== 'BlockStatement') {
    return false;
  }

  const directives = (body.directives ?? []) as AnyNode[];
  return directives.some(directive => (directive.value as AnyNode | undefined)?.value === DIRECTIVE);
}

// Resolution ladder for the function's display name. Today every opted-out function is a
// named declaration, so `node.id.name` covers all of them; the rest is insurance against
// the bundler ever rewriting declarations into assigned expressions.
function resolveFunctionName(node: AnyNode, ancestors: AnyNode[]): string {
  const id = node.id as AnyNode | undefined;

  if (typeof id?.name === 'string') {
    return id.name;
  }

  const key = node.key as AnyNode | undefined;

  if ((node.type === 'ObjectMethod' || node.type === 'ClassMethod') && key?.type === 'Identifier') {
    return key.name as string;
  }

  for (let i = ancestors.length - 1; i >= 0; i--) {
    const ancestor = ancestors[i];

    if (ancestor.type === 'VariableDeclarator' && (ancestor.id as AnyNode | undefined)?.type === 'Identifier') {
      return (ancestor.id as AnyNode).name as string;
    }

    if (ancestor.type === 'ObjectProperty' && (ancestor.key as AnyNode | undefined)?.type === 'Identifier') {
      return (ancestor.key as AnyNode).name as string;
    }

    if (ancestor.type === 'AssignmentExpression' && (ancestor.left as AnyNode | undefined)?.type === 'Identifier') {
      return (ancestor.left as AnyNode).name as string;
    }

    if (FUNCTION_TYPES.has(ancestor.type)) {
      return '<anonymous>';
    }
  }

  return '<anonymous>';
}

function collectDirectiveFunctionNames(program: AnyNode): string[] {
  const found: string[] = [];

  function walk(value: unknown, ancestors: AnyNode[]) {
    if (Array.isArray(value)) {
      value.forEach(item => walk(item, ancestors));
      return;
    }

    if (!isNode(value)) {
      return;
    }

    if (FUNCTION_TYPES.has(value.type) && hasDirective(value)) {
      found.push(resolveFunctionName(value, ancestors));
    }

    const next = [...ancestors, value];

    for (const key of Object.keys(value)) {
      if (!SKIPPED_KEYS.has(key)) {
        walk(value[key], next);
      }
    }
  }

  walk(program, []);
  return found;
}

function parseFile(filePath: string): AnyNode | null {
  const code = fs.readFileSync(filePath, 'utf8');
  const isSource = /\.tsx?$/.test(filePath);

  const ast = parseSync(code, {
    filename: filePath,
    babelrc: false,
    configFile: false,
    sourceType: filePath.endsWith('.mjs') ? 'module' : 'unambiguous',
    parserOpts: isSource ? { plugins: filePath.endsWith('.tsx') ? ['typescript', 'jsx'] : ['typescript'] } : {},
  });

  return ast === null ? null : (ast.program as unknown as AnyNode);
}

export function checkUseNoMemoDirectives(pkg: TargetPackage, extractedDir: string): string[] {
  const packageDir = path.join(getRootPath(), pkg.dir);
  const sourceFiles = fg.sync(['src/**/*.ts', 'src/**/*.tsx'], {
    cwd: packageDir,
    absolute: true,
    ignore: IGNORED_GLOBS,
  });

  if (sourceFiles.length === 0) {
    return ['🚨 Scanned 0 source files — the globs in this check no longer match the package layout.'];
  }

  const problems: string[] = [];

  // name → source files (relative) declaring a `'use no memo'` function with that name.
  const expected = new Map<string, string[]>();

  for (const filePath of sourceFiles) {
    const program = parseFile(filePath);

    if (program === null) {
      problems.push(`failed to parse source file ${path.relative(packageDir, filePath)}`);
      continue;
    }

    for (const name of collectDirectiveFunctionNames(program)) {
      const relativePath = path.relative(packageDir, filePath);
      expected.set(name, [...(expected.get(name) ?? []), relativePath]);
    }
  }

  if (expected.size === 0 && problems.length === 0) {
    console.log(`Scanned ${sourceFiles.length} source files — 0 '${DIRECTIVE}' directives expected.`);
    return problems;
  }

  const distFiles = walkFiles(extractedDir);
  const formats: Array<{ extension: '.mjs' | '.cjs'; names: Set<string>; fileCount: number }> = [];

  for (const extension of ['.mjs', '.cjs'] as const) {
    const files = distFiles.filter(file => file.endsWith(extension));

    if (files.length === 0) {
      problems.push(
        `🚨 Scanned 0 ${extension} files — the paths in this check no longer match the build output layout.`
      );
      continue;
    }

    const names = new Set<string>();

    for (const filePath of files) {
      let program: AnyNode | null;

      try {
        program = parseFile(filePath);
      } catch (error) {
        problems.push(
          `failed to parse ${path.relative(extractedDir, filePath)}: ${error instanceof Error ? error.message : String(error)}`
        );
        continue;
      }

      if (program === null) {
        continue;
      }

      collectDirectiveFunctionNames(program).forEach(name => names.add(name));
    }

    formats.push({ extension, names, fileCount: files.length });
  }

  for (const [name, declaredIn] of expected) {
    for (const { extension, names, fileCount } of formats) {
      if (!names.has(name)) {
        problems.push(
          `${name} — '${DIRECTIVE}' (declared in ${declaredIn.join(', ')}) is not a function-body ` +
            `directive in any of ${fileCount} ${extension} files under the packed dist/`
        );
      }
    }
  }

  if (problems.length === 0) {
    const scanned = formats.map(({ fileCount, extension }) => `${fileCount} ${extension}`).join(' and ');
    console.log(`Verified ${expected.size} '${DIRECTIVE}' directive(s) across ${scanned} files.`);
  }

  return problems;
}
