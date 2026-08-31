import ts from 'typescript';

import { MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME } from '../../constants.ts';
import type { SourceChange, Splice, TransformSourceResult } from '../../types.ts';

import { collectSpecifiers, lineOf, parseSource } from './collectSpecifiers.ts';
import { buildMergeSplices } from './mergeImports.ts';

function rewriteSpecifier(sourceFile: ts.SourceFile, literal: ts.StringLiteralLike): Splice {
  const start = literal.getStart(sourceFile);
  // Reuse the source's own quote character — a backtick included — so the edit never
  // fights whatever quote style the project's formatter enforces.
  const quote = sourceFile.text.slice(start, start + 1);

  return { start, end: literal.getEnd(), text: `${quote}${ROOT_PACKAGE_NAME}${quote}` };
}

function applySplices(code: string, splices: readonly Splice[]): string {
  // Right to left, so offsets computed against the original text stay valid.
  return [...splices]
    .sort((a, b) => b.start - a.start)
    .reduce((text, splice) => text.slice(0, splice.start) + splice.text + text.slice(splice.end), code);
}

export function transformSource(code: string, fileName: string): TransformSourceResult {
  // Parsing every file in a repository is the dominant cost of a run, and a file that
  // never spells the package name cannot contain a specifier for it.
  if (!code.includes(MOBILE_PACKAGE_NAME)) {
    return { code, changes: [] };
  }

  const sourceFile = parseSource(code, fileName);
  const hits = collectSpecifiers(sourceFile);

  if (hits.length === 0) {
    return { code, changes: [] };
  }

  const merge = buildMergeSplices(sourceFile, hits);

  const splices: Splice[] = [...merge.splices];
  const changes: SourceChange[] = [...merge.changes];

  for (const hit of hits) {
    // A merged declaration is deleted wholesale — rewriting its specifier too would
    // produce two splices overlapping the same range.
    if (hit.declaration !== undefined && merge.mergedDeclarations.has(hit.declaration)) {
      continue;
    }

    splices.push(rewriteSpecifier(sourceFile, hit.literal));
    changes.push({ line: lineOf(sourceFile, hit.literal.getStart(sourceFile)), kind: hit.kind });
  }

  return {
    code: applySplices(code, splices),
    changes: [...changes].sort((a, b) => a.line - b.line),
  };
}
