import path from 'node:path';
import ts from 'typescript';

import { MOBILE_PACKAGE_NAME } from '../../constants.ts';
import type { ChangeKind } from '../../types.ts';

export type SpecifierHit = {
  literal: ts.StringLiteralLike;
  kind: ChangeKind;
  // Present only for plain `import ... from '...'` declarations, which are the only
  // form the merge pass can fold into an existing react-simplikit import.
  declaration: ts.ImportDeclaration | undefined;
};

const MOCK_OBJECTS = new Set(['vi', 'jest']);
const MOCK_METHODS = new Set(['mock', 'doMock', 'unmock', 'dontMock', 'requireActual', 'requireMock']);

const SCRIPT_KIND_BY_EXTENSION = new Map<string, ts.ScriptKind>([
  ['.ts', ts.ScriptKind.TS],
  ['.mts', ts.ScriptKind.TS],
  ['.cts', ts.ScriptKind.TS],
  ['.tsx', ts.ScriptKind.TSX],
  ['.js', ts.ScriptKind.JS],
  ['.mjs', ts.ScriptKind.JS],
  ['.cjs', ts.ScriptKind.JS],
  ['.jsx', ts.ScriptKind.JSX],
]);

export function parseSource(code: string, fileName: string): ts.SourceFile {
  // TSX is the permissive default: it parses everything the other kinds do except
  // the `<T>value` type assertion, which is rare next to unrecognized extensions.
  const scriptKind = SCRIPT_KIND_BY_EXTENSION.get(path.extname(fileName)) ?? ts.ScriptKind.TSX;

  return ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true, scriptKind);
}

export function lineOf(sourceFile: ts.SourceFile, position: number): number {
  return sourceFile.getLineAndCharacterOfPosition(position).line + 1;
}

function isMobileSpecifier(node: ts.Node): node is ts.StringLiteralLike {
  return ts.isStringLiteralLike(node) && node.text === MOBILE_PACKAGE_NAME;
}

function isMockCall(expression: ts.LeftHandSideExpression): boolean {
  return (
    ts.isPropertyAccessExpression(expression) &&
    ts.isIdentifier(expression.expression) &&
    MOCK_OBJECTS.has(expression.expression.text) &&
    MOCK_METHODS.has(expression.name.text)
  );
}

export function collectSpecifiers(sourceFile: ts.SourceFile): SpecifierHit[] {
  const hits: SpecifierHit[] = [];

  function visitCall(node: ts.CallExpression): void {
    const [first] = node.arguments;

    if (first === undefined || !isMobileSpecifier(first)) {
      return;
    }

    if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      hits.push({ literal: first, kind: 'dynamic-import', declaration: undefined });
    } else if (ts.isIdentifier(node.expression) && node.expression.text === 'require') {
      hits.push({ literal: first, kind: 'require', declaration: undefined });
    } else if (isMockCall(node.expression)) {
      hits.push({ literal: first, kind: 'mock', declaration: undefined });
    }
  }

  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node) && isMobileSpecifier(node.moduleSpecifier)) {
      hits.push({ literal: node.moduleSpecifier, kind: 'import', declaration: node });
    } else if (
      ts.isExportDeclaration(node) &&
      node.moduleSpecifier !== undefined &&
      isMobileSpecifier(node.moduleSpecifier)
    ) {
      hits.push({ literal: node.moduleSpecifier, kind: 'export', declaration: undefined });
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      isMobileSpecifier(node.argument.literal)
    ) {
      hits.push({ literal: node.argument.literal, kind: 'import-type', declaration: undefined });
    } else if (ts.isCallExpression(node)) {
      visitCall(node);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return hits;
}
