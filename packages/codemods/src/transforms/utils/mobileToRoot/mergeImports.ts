import j, { type ImportDeclaration, type ImportSpecifier } from 'jscodeshift';

import { lineOf, type ParsedSource, spanOf, type SpecifierHit } from './collectSpecifiers.ts';
import { ROOT_PACKAGE_NAME } from './constants.ts';
import type { SourceChange, SourceNote, Splice } from './types.ts';

export type MergeResult = {
  splices: Splice[];
  changes: SourceChange[];
  notes: SourceNote[];
  mergedDeclarations: Set<ImportDeclaration>;
};

type PlainNamedImport = {
  declaration: ImportDeclaration;
  elements: ImportSpecifier[];
  isTypeOnly: boolean;
};

function plainNamedImportOf(code: string, declaration: ImportDeclaration): PlainNamedImport | undefined {
  // Babel always fills the list; ast-types marks it optional.
  const specifiers = declaration.specifiers!;
  const elements = specifiers.filter(specifier => j.ImportSpecifier.check(specifier));

  if (elements.length !== specifiers.length) {
    return undefined;
  }

  // Babel gives `import {} from 'x'` and `import 'x'` the same empty list; only the braces tell them apart.
  if (elements.length === 0 && !code.slice(spanOf(declaration).start, spanOf(declaration.source).start).includes('{')) {
    return undefined;
  }

  return { declaration, elements, isTypeOnly: declaration.importKind === 'type' };
}

function deletionRange(code: string, statement: ImportDeclaration): Splice {
  const { start, end } = spanOf(statement);

  const lineStart = code.lastIndexOf('\n', start - 1) + 1;
  const newlineIndex = code.indexOf('\n', end);
  const lineEnd = newlineIndex === -1 ? code.length : newlineIndex + 1;

  const ownsLine = code.slice(lineStart, start).trim() === '' && code.slice(end, lineEnd).trim() === '';

  return ownsLine ? { start: lineStart, end: lineEnd, text: '' } : { start, end, text: '' };
}

function losesComment({ code, comments }: ParsedSource, statement: ImportDeclaration) {
  const { start, end } = spanOf(statement);
  const newlineIndex = code.indexOf('\n', end);
  const lineEnd = newlineIndex === -1 ? code.length : newlineIndex;

  return comments.some(comment => comment.start >= start && comment.start < lineEnd);
}

function elementSeparator(code: string, last: ImportSpecifier) {
  const lastStart = spanOf(last).start;
  const lead = code.slice(code.lastIndexOf('\n', lastStart - 1) + 1, lastStart);

  return lead.trim() === '' ? `,\n${lead}` : ', ';
}

function insertIntoNamedImports(code: string, target: PlainNamedImport, appended: readonly string[]): Splice {
  const last = target.elements.at(-1);

  if (last === undefined) {
    const position = code.indexOf('{', spanOf(target.declaration).start) + 1;

    return { start: position, end: position, text: appended.join(', ') };
  }

  const separator = elementSeparator(code, last);
  const position = spanOf(last).end;

  return { start: position, end: position, text: `${separator}${appended.join(separator)}` };
}

// Babel rejects a name imported twice in one scope, so two imports that reach this point never bind the same name.
export function buildMergeSplices(parsed: ParsedSource, hits: readonly SpecifierHit[]): MergeResult {
  const { code } = parsed;
  const statements = parsed.root.find(j.Program).nodes()[0].body;
  const targets = statements
    .filter(statement => j.ImportDeclaration.check(statement))
    .filter(statement => statement.source.value === ROOT_PACKAGE_NAME)
    .map(statement => plainNamedImportOf(code, statement))
    .filter(target => target !== undefined);
  const splices: Splice[] = [];
  const changes: SourceChange[] = [];
  const notes: SourceNote[] = [];
  const mergedDeclarations = new Set<ImportDeclaration>();
  const appendedByTarget = new Map<PlainNamedImport, string[]>();

  for (const { declaration } of hits) {
    if (declaration === undefined || !statements.includes(declaration)) {
      continue;
    }

    const source = plainNamedImportOf(code, declaration);
    const target = targets.find(candidate => candidate.isTypeOnly === source?.isTypeOnly);

    if (source === undefined || target === undefined) {
      continue;
    }

    const line = lineOf(code, spanOf(declaration).start);

    if (losesComment(parsed, declaration)) {
      notes.push({
        line,
        reason: 'Left on its own line: a comment sits on it, and merging would strand that comment.',
      });
      continue;
    }

    const additions = source.elements.map(element => code.slice(spanOf(element).start, spanOf(element).end));

    appendedByTarget.set(target, [...(appendedByTarget.get(target) ?? []), ...additions]);
    splices.push(deletionRange(code, declaration));
    changes.push({ line, kind: 'merge' });
    mergedDeclarations.add(declaration);
  }

  for (const [target, appended] of appendedByTarget) {
    if (appended.length > 0) {
      splices.push(insertIntoNamedImports(code, target, appended));
    }
  }

  return { splices, changes, notes, mergedDeclarations };
}
