import ts from 'typescript';

import { ROOT_PACKAGE_NAME } from '../constants.ts';

import { lineOf, type SpecifierHit } from './collectSpecifiers.ts';
import type { SourceChange, SourceNote, Splice } from './types.ts';

export type MergeResult = {
  splices: Splice[];
  changes: SourceChange[];
  notes: SourceNote[];
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

function deletionRange(sourceFile: ts.SourceFile, statement: ts.Statement): Splice {
  const { text } = sourceFile;
  const start = statement.getStart(sourceFile);
  const end = statement.getEnd();

  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const newlineIndex = text.indexOf('\n', end);
  const lineEnd = newlineIndex === -1 ? text.length : newlineIndex + 1;

  const ownsLine = text.slice(lineStart, start).trim() === '' && text.slice(end, lineEnd).trim() === '';

  return ownsLine ? { start: lineStart, end: lineEnd, text: '' } : { start, end, text: '' };
}

function losesComment(sourceFile: ts.SourceFile, statement: ts.Statement): boolean {
  const { text } = sourceFile;
  const start = statement.getStart(sourceFile);
  const newlineIndex = text.indexOf('\n', statement.getEnd());
  const end = newlineIndex === -1 ? text.length : newlineIndex;
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    sourceFile.languageVariant,
    text,
    undefined,
    start,
    end - start
  );

  for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    if (token === ts.SyntaxKind.SingleLineCommentTrivia || token === ts.SyntaxKind.MultiLineCommentTrivia) {
      return true;
    }
  }

  return false;
}

function elementSeparator(sourceFile: ts.SourceFile, last: ts.ImportSpecifier): string {
  const { text } = sourceFile;
  const lastStart = last.getStart(sourceFile);
  const lead = text.slice(text.lastIndexOf('\n', lastStart - 1) + 1, lastStart);

  return lead.trim() === '' ? `,\n${lead}` : ', ';
}

function insertIntoNamedImports(
  sourceFile: ts.SourceFile,
  named: ts.NamedImports,
  appended: readonly string[]
): Splice {
  const last = named.elements.at(-1);

  if (last === undefined) {
    const position = named.getStart(sourceFile) + 1;

    return { start: position, end: position, text: appended.join(', ') };
  }

  const separator = elementSeparator(sourceFile, last);
  const position = last.getEnd();

  return { start: position, end: position, text: `${separator}${appended.join(separator)}` };
}

export function buildMergeSplices(sourceFile: ts.SourceFile, hits: readonly SpecifierHit[]): MergeResult {
  const splices: Splice[] = [];
  const changes: SourceChange[] = [];
  const notes: SourceNote[] = [];
  const mergedDeclarations = new Set<ts.ImportDeclaration>();
  const targets = collectTargets(sourceFile);
  const boundByTarget = new Map<ts.NamedImports, Map<string, string>>();
  const appendedByTarget = new Map<ts.NamedImports, string[]>();

  for (const hit of hits) {
    const { declaration } = hit;

    if (declaration === undefined || declaration.parent !== sourceFile) {
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

    const line = lineOf(sourceFile, declaration.getStart(sourceFile));

    if (losesComment(sourceFile, declaration)) {
      notes.push({
        line,
        reason: 'Left on its own line: a comment sits on it, and merging would strand that comment.',
      });
      continue;
    }

    const bound =
      boundByTarget.get(target.named) ??
      new Map(target.named.elements.map(element => [element.name.text, importedNameOf(element)]));

    const additions: string[] = [];
    let collision: string | undefined;

    for (const element of source.named.elements) {
      const existing = bound.get(element.name.text);

      if (existing === undefined) {
        additions.push(sourceFile.text.slice(element.getStart(sourceFile), element.getEnd()));
      } else if (existing !== importedNameOf(element)) {
        collision = element.name.text;
        break;
      }
    }

    if (collision !== undefined) {
      notes.push({
        line,
        reason: `Left on its own line: \`${collision}\` already refers to a different import here. Merging it by hand would change what the name binds.`,
      });
      continue;
    }

    for (const element of source.named.elements) {
      bound.set(element.name.text, importedNameOf(element));
    }

    boundByTarget.set(target.named, bound);
    appendedByTarget.set(target.named, [...(appendedByTarget.get(target.named) ?? []), ...additions]);

    splices.push(deletionRange(sourceFile, declaration));
    changes.push({ line, kind: 'merge' });
    mergedDeclarations.add(declaration);
  }

  for (const [named, appended] of appendedByTarget) {
    if (appended.length > 0) {
      splices.push(insertIntoNamedImports(sourceFile, named, appended));
    }
  }

  return { splices, changes, notes, mergedDeclarations };
}
