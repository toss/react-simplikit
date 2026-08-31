import path from 'node:path';
import ts from 'typescript';

import { MOBILE_PACKAGE_NAME } from '../../constants.ts';
import type { ChangeKind } from '../../types.ts';

export type SpecifierHit = {
  literal: ts.StringLiteralLike;
  kind: ChangeKind;
  declaration: ts.ImportDeclaration | undefined;
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
  const scriptKind = SCRIPT_KIND_BY_EXTENSION.get(path.extname(fileName)) ?? ts.ScriptKind.TSX;

  return ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true, scriptKind);
}

export function lineOf(sourceFile: ts.SourceFile, position: number): number {
  return sourceFile.getLineAndCharacterOfPosition(position).line + 1;
}

function isMobileSpecifier(node: ts.Node): node is ts.StringLiteralLike {
  return ts.isStringLiteralLike(node) && node.text === MOBILE_PACKAGE_NAME;
}

function callKind(expression: ts.LeftHandSideExpression): ChangeKind | undefined {
  if (expression.kind === ts.SyntaxKind.ImportKeyword) {
    return 'dynamic-import';
  }

  if (ts.isIdentifier(expression)) {
    return expression.text === 'require' ? 'require' : undefined;
  }

  if (!ts.isPropertyAccessExpression(expression) || !ts.isIdentifier(expression.expression)) {
    return undefined;
  }

  const object = expression.expression.text;
  const method = expression.name.text;

  if (object === 'require' && method === 'resolve') {
    return 'require';
  }

  return MOCK_OBJECTS.has(object) && MOCK_METHODS.has(method) ? 'mock' : undefined;
}

function visitCall(node: ts.CallExpression, hits: SpecifierHit[]): void {
  const [first] = node.arguments;

  if (first === undefined || !isMobileSpecifier(first)) {
    return;
  }

  const kind = callKind(node.expression);

  if (kind !== undefined) {
    hits.push({ literal: first, kind, declaration: undefined });
  }
}

export function collectSpecifiers(sourceFile: ts.SourceFile): SpecifierHit[] {
  const hits: SpecifierHit[] = [];

  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node) && isMobileSpecifier(node.moduleSpecifier)) {
      hits.push({ literal: node.moduleSpecifier, kind: 'import', declaration: node });
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      isMobileSpecifier(node.moduleReference.expression)
    ) {
      hits.push({ literal: node.moduleReference.expression, kind: 'require', declaration: undefined });
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
      visitCall(node, hits);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return hits;
}
