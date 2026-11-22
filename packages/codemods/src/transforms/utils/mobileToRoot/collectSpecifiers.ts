import j, { type CallExpression, type Collection, type File, type ImportDeclaration } from 'jscodeshift';
// @ts-expect-error: Declaration files are not included
import babylon from 'jscodeshift/parser/babylon';
// @ts-expect-error: Declaration files are not included
import tsOptions from 'jscodeshift/parser/tsOptions';

import { MOBILE_PACKAGE_NAME } from './constants.ts';
import type { ChangeKind, Span } from './types.ts';

export type ParsedSource = {
  code: string;
  root: Collection<File>;
  comments: Span[];
};

export type SpecifierHit = {
  literal: Span;
  kind: ChangeKind;
  declaration: ImportDeclaration | undefined;
};

const MOCK_OBJECTS = new Set(['vi', 'jest']);

const MOCK_METHODS = new Set([
  'mock',
  'doMock',
  'unmock',
  'dontMock',
  'requireActual',
  'requireMock',
  'importActual',
  'importMock',
]);

type Parser = { parse: (code: string) => File & { comments: object[] } };

// `unambiguous` reads a file without import or export as a script, so sloppy-mode CommonJS still parses.
// `deprecatedAssertSyntax` keeps `import data from './a.json' assert { type: 'json' }` readable.
const tsPlugins: unknown[] = tsOptions.plugins.map((plugin: unknown) =>
  plugin === 'importAttributes' ? ['importAttributes', { deprecatedAssertSyntax: true }] : plugin
);
const tsParser: Parser = babylon({ ...tsOptions, sourceType: 'unambiguous', plugins: tsPlugins });
const tsxParser: Parser = babylon({ ...tsOptions, sourceType: 'unambiguous', plugins: ['jsx', ...tsPlugins] });
// jscodeshift's default Babel options read Flow and JSX.
const flowParser: Parser = babylon();

function parseFile(code: string, fileName: string) {
  if (/\.[mc]?ts$/.test(fileName)) {
    return tsParser.parse(code);
  }

  try {
    return tsxParser.parse(code);
  } catch (error) {
    if (!/\.[mc]?jsx?$/.test(fileName)) {
      throw error;
    }

    try {
      return flowParser.parse(code);
    } catch {
      throw error;
    }
  }
}

// Straight to Babel, not through recast: recast widens tabs before it records offsets, and the edits splice by offset.
export function parseSource(code: string, fileName: string): ParsedSource {
  const file = parseFile(code, fileName);

  return { code, root: j(file), comments: file.comments.map(spanOf) };
}

// Babel records the offsets on every node; ast-types leaves them out of its types.
export function spanOf(node: object): Span {
  return node as Span;
}

export function lineOf(code: string, position: number): number {
  return code.slice(0, position).split('\n').length;
}

function mobileSpecifierOf(node: object | null | undefined): Span | undefined {
  if (j.StringLiteral.check(node)) {
    return node.value === MOBILE_PACKAGE_NAME ? spanOf(node) : undefined;
  }

  if (j.TemplateLiteral.check(node) && node.expressions.length === 0) {
    return node.quasis[0]?.value.cooked === MOBILE_PACKAGE_NAME ? spanOf(node) : undefined;
  }

  return undefined;
}

// The return annotation stays: without it the string literals below widen to `string`.
function callKind(callee: CallExpression['callee']): ChangeKind | undefined {
  if (callee.type === 'Import') {
    return 'dynamic-import';
  }

  if (j.Identifier.check(callee)) {
    return callee.name === 'require' ? 'require' : undefined;
  }

  if (
    !j.MemberExpression.check(callee) ||
    callee.computed === true ||
    !j.Identifier.check(callee.object) ||
    !j.Identifier.check(callee.property)
  ) {
    return undefined;
  }

  const object = callee.object.name;
  const method = callee.property.name;

  if (object === 'require' && method === 'resolve') {
    return 'require';
  }

  return MOCK_OBJECTS.has(object) && MOCK_METHODS.has(method) ? 'mock' : undefined;
}

export function collectSpecifiers({ root }: ParsedSource): SpecifierHit[] {
  const hits: SpecifierHit[] = [];

  function add(node: object | null | undefined, kind: ChangeKind, declaration?: ImportDeclaration) {
    const literal = mobileSpecifierOf(node);

    if (literal !== undefined) {
      hits.push({ literal, kind, declaration });
    }
  }

  root.find(j.ImportDeclaration).forEach(path => add(path.node.source, 'import', path.node));
  root.find(j.ExportNamedDeclaration).forEach(path => add(path.node.source, 'export'));
  root.find(j.ExportAllDeclaration).forEach(path => add(path.node.source, 'export'));
  root.find(j.TSImportType).forEach(path => add(path.node.argument, 'import-type'));
  root.find(j.TSExternalModuleReference).forEach(path => add(path.node.expression, 'require'));
  root.find(j.CallExpression).forEach(path => {
    const kind = callKind(path.node.callee);

    if (kind !== undefined) {
      add(path.node.arguments[0], kind);
    }
  });

  return hits.toSorted((a, b) => a.literal.start - b.literal.start);
}
