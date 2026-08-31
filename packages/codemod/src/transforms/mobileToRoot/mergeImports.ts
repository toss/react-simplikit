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

/**
 * The named list of an import that can move into, or receive, another named list.
 * Returns `undefined` for every shape that binds something a named list cannot carry.
 */
function plainNamedImportOf(declaration: ts.ImportDeclaration): PlainNamedImport | undefined {
  const clause = declaration.importClause;

  // `import '...'` binds nothing at all.
  if (clause === undefined) {
    return undefined;
  }

  const { name, namedBindings, isTypeOnly } = clause;

  // Order matters: `namedBindings` is checked first because a default-only import
  // (`import D from '...'`) reaches it, while a default+named import is caught by the
  // `name` check and a namespace import by the last one.
  if (namedBindings === undefined || name !== undefined || !ts.isNamedImports(namedBindings)) {
    return undefined;
  }

  return { named: namedBindings, isTypeOnly };
}

type MergeTarget = PlainNamedImport;

function collectTargets(sourceFile: ts.SourceFile): MergeTarget[] {
  const targets: MergeTarget[] = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) {
      continue;
    }

    // A well-formed import always has a string literal here, but the parser also
    // recovers from `import { a } from someIdentifier` — guard so a broken file
    // degrades to a no-op instead of merging into nothing.
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

/**
 * Whether the braces hold a comment. Nothing else inside a named import can contain
 * `//` or `/*` — a module specifier lives outside them — so scanning the text is exact.
 */
function containsComment(sourceFile: ts.SourceFile, named: ts.NamedImports): boolean {
  const text = sourceFile.text.slice(named.getStart(sourceFile), named.getEnd());

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

  // Swallow the whole line only when the statement owns it; otherwise a second
  // statement sharing the line would disappear with it.
  return ownsLine ? { start: lineStart, end: lineEnd, text: '' } : { start, end, text: '' };
}

function insertIntoNamedImports(
  sourceFile: ts.SourceFile,
  named: ts.NamedImports,
  appended: readonly string[]
): Splice {
  const last = named.elements.at(-1);

  if (last === undefined) {
    // `import {} from 'react-simplikit'` — between the braces is the only place to write.
    const position = named.getStart(sourceFile) + 1;

    return { start: position, end: position, text: appended.join(', ') };
  }

  const position = last.getEnd();

  return { start: position, end: position, text: `, ${appended.join(', ')}` };
}

export function buildMergeSplices(sourceFile: ts.SourceFile, hits: readonly SpecifierHit[]): MergeResult {
  const splices: Splice[] = [];
  const changes: SourceChange[] = [];
  const mergedDeclarations = new Set<ts.ImportDeclaration>();
  const targets = collectTargets(sourceFile);

  const appendedByTarget = new Map<ts.NamedImports, string[]>();
  const takenByTarget = new Map<ts.NamedImports, Set<string>>();

  for (const hit of hits) {
    const { declaration } = hit;

    if (declaration === undefined) {
      continue;
    }

    const source = plainNamedImportOf(declaration);

    if (source === undefined) {
      continue;
    }

    // Merging copies specifier text only, so a comment between the braces would be
    // dropped. Leave the statement alone and let the specifier rewrite handle it.
    if (containsComment(sourceFile, source.named)) {
      continue;
    }

    // Same type-onlyness only: folding `import type` into a value import would need
    // inline `type` modifiers, and the consumer's TypeScript version is unknown.
    const target = targets.find(candidate => candidate.isTypeOnly === source.isTypeOnly);

    if (target === undefined) {
      continue;
    }

    const taken = takenByTarget.get(target.named) ?? new Set(target.named.elements.map(element => element.name.text));
    const appended = appendedByTarget.get(target.named) ?? [];

    for (const element of source.named.elements) {
      if (taken.has(element.name.text)) {
        continue;
      }

      taken.add(element.name.text);
      // Copy the element's own source text so aliases and inline `type` survive.
      appended.push(sourceFile.text.slice(element.getStart(sourceFile), element.getEnd()));
    }

    takenByTarget.set(target.named, taken);
    appendedByTarget.set(target.named, appended);

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
