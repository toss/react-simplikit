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

// Local name → the name it imports, e.g. `isApple` → `isIOS` for `import { isIOS as isApple }`.
type Bindings = ReadonlyMap<string, string>;

function importedNameOf(element: ts.ImportSpecifier) {
  return (element.propertyName ?? element.name).text;
}

function bindingsOf(named: ts.NamedImports): Bindings {
  return new Map(named.elements.map(element => [element.name.text, importedNameOf(element)]));
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

function isRootImport(statement: ts.Statement): statement is ts.ImportDeclaration {
  return (
    ts.isImportDeclaration(statement) &&
    ts.isStringLiteralLike(statement.moduleSpecifier) &&
    statement.moduleSpecifier.text === ROOT_PACKAGE_NAME
  );
}

function collectTargets(sourceFile: ts.SourceFile) {
  return sourceFile.statements
    .filter(isRootImport)
    .map(plainNamedImportOf)
    .filter(target => target !== undefined);
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

function losesComment(sourceFile: ts.SourceFile, statement: ts.Statement) {
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

// The local name that already means something else on the target, if there is one.
function collisionBetween(bound: Bindings, source: ts.NamedImports) {
  const clash = source.elements.find(element => {
    const existing = bound.get(element.name.text);

    return existing !== undefined && existing !== importedNameOf(element);
  });

  return clash?.name.text;
}

function refusalFor(
  sourceFile: ts.SourceFile,
  declaration: ts.ImportDeclaration,
  bound: Bindings,
  source: ts.NamedImports
) {
  if (losesComment(sourceFile, declaration)) {
    return 'Left on its own line: a comment sits on it, and merging would strand that comment.';
  }

  const collision = collisionBetween(bound, source);

  if (collision !== undefined) {
    return `Left on its own line: \`${collision}\` already refers to a different import here. Merging it by hand would change what the name binds.`;
  }

  return undefined;
}

function elementSeparator(sourceFile: ts.SourceFile, last: ts.ImportSpecifier) {
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
  const targets = collectTargets(sourceFile);
  const splices: Splice[] = [];
  const changes: SourceChange[] = [];
  const notes: SourceNote[] = [];
  const mergedDeclarations = new Set<ts.ImportDeclaration>();
  const boundByTarget = new Map<ts.NamedImports, Bindings>();
  const appendedByTarget = new Map<ts.NamedImports, string[]>();

  for (const { declaration } of hits) {
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
    const bound = boundByTarget.get(target.named) ?? bindingsOf(target.named);
    const refusal = refusalFor(sourceFile, declaration, bound, source.named);

    if (refusal !== undefined) {
      notes.push({ line, reason: refusal });
      continue;
    }

    const additions = source.named.elements
      .filter(element => !bound.has(element.name.text))
      .map(element => sourceFile.text.slice(element.getStart(sourceFile), element.getEnd()));

    boundByTarget.set(target.named, new Map([...bound, ...bindingsOf(source.named)]));
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
