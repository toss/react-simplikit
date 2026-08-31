import ts from 'typescript';

import { ROOT_PACKAGE_NAME } from '../../constants.ts';
import type { SourceChange, Splice } from '../../types.ts';

import { lineOf, type SpecifierHit } from './collectSpecifiers.ts';

export type MergeResult = {
  splices: Splice[];
  changes: SourceChange[];
  mergedDeclarations: Set<ts.ImportDeclaration>;
};

type PlainNamedImport = {
  named: ts.NamedImports;
  isTypeOnly: boolean;
};

function importedNameOf(element: ts.ImportSpecifier): string {
  return (element.propertyName ?? element.name).text;
}

function plainNamedImportOf(declaration: ts.ImportDeclaration): PlainNamedImport | undefined {
  const clause = declaration.importClause;

  if (clause === undefined) {
    return undefined;
  }

  const { name, namedBindings, isTypeOnly } = clause;

  if (namedBindings === undefined || name !== undefined || !ts.isNamedImports(namedBindings)) {
    return undefined;
  }

  return { named: namedBindings, isTypeOnly };
}

function collectTargets(sourceFile: ts.SourceFile): PlainNamedImport[] {
  const targets: PlainNamedImport[] = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) {
      continue;
    }

    if (!ts.isStringLiteralLike(statement.moduleSpecifier) || statement.moduleSpecifier.text !== ROOT_PACKAGE_NAME) {
      continue;
    }

    const target = plainNamedImportOf(statement);

    if (target !== undefined) {
      targets.push(target);
    }
  }

  return targets;
}

function hasComment(sourceFile: ts.SourceFile, statement: ts.Statement): boolean {
  const text = sourceFile.text.slice(statement.getFullStart(), statement.getEnd());

  return text.includes('//') || text.includes('/*');
}

function deleteStatement(sourceFile: ts.SourceFile, statement: ts.Statement): Splice {
  const { text } = sourceFile;
  const start = statement.getStart(sourceFile);
  const end = statement.getEnd();

  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const newlineIndex = text.indexOf('\n', end);
  const lineEnd = newlineIndex === -1 ? text.length : newlineIndex + 1;

  const ownsLine = text.slice(lineStart, start).trim() === '' && text.slice(end, lineEnd).trim() === '';

  return ownsLine ? { start: lineStart, end: lineEnd, text: '' } : { start, end, text: '' };
}

function insertIntoNamedImports(
  sourceFile: ts.SourceFile,
  named: ts.NamedImports,
  appended: readonly string[]
): Splice {
  const last = named.elements.at(-1);
  const position = last === undefined ? named.getStart(sourceFile) + 1 : last.getEnd();
  const text = last === undefined ? appended.join(', ') : `, ${appended.join(', ')}`;

  return { start: position, end: position, text };
}

export function buildMergeSplices(sourceFile: ts.SourceFile, hits: readonly SpecifierHit[]): MergeResult {
  const splices: Splice[] = [];
  const changes: SourceChange[] = [];
  const mergedDeclarations = new Set<ts.ImportDeclaration>();
  const targets = collectTargets(sourceFile);
  const boundByTarget = new Map<ts.NamedImports, Map<string, string>>();
  const appendedByTarget = new Map<ts.NamedImports, string[]>();

  for (const hit of hits) {
    const { declaration } = hit;

    if (declaration === undefined || declaration.parent !== sourceFile || hasComment(sourceFile, declaration)) {
      continue;
    }

    const source = plainNamedImportOf(declaration);

    if (source === undefined) {
      continue;
    }

    const target = targets.find(candidate => candidate.isTypeOnly === source.isTypeOnly);

    if (target === undefined) {
      continue;
    }

    const bound =
      boundByTarget.get(target.named) ??
      new Map(target.named.elements.map(element => [element.name.text, importedNameOf(element)]));

    const additions: string[] = [];
    let collides = false;

    for (const element of source.named.elements) {
      const existing = bound.get(element.name.text);

      if (existing === undefined) {
        additions.push(sourceFile.text.slice(element.getStart(sourceFile), element.getEnd()));
      } else if (existing !== importedNameOf(element)) {
        collides = true;
        break;
      }
    }

    if (collides) {
      continue;
    }

    for (const element of source.named.elements) {
      bound.set(element.name.text, importedNameOf(element));
    }

    boundByTarget.set(target.named, bound);
    appendedByTarget.set(target.named, [...(appendedByTarget.get(target.named) ?? []), ...additions]);

    splices.push(deleteStatement(sourceFile, declaration));
    changes.push({ line: lineOf(sourceFile, declaration.getStart(sourceFile)), kind: 'merge' });
    mergedDeclarations.add(declaration);
  }

  for (const [named, appended] of appendedByTarget) {
    if (appended.length > 0) {
      splices.push(insertIntoNamedImports(sourceFile, named, appended));
    }
  }

  return { splices, changes, mergedDeclarations };
}
