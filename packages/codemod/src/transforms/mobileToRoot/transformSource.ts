import ts from 'typescript';

import { MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME } from '../../constants.ts';
import type { SourceChange, Splice, TransformSourceResult } from '../../types.ts';

import { collectSpecifiers, lineOf, parseSource } from './collectSpecifiers.ts';
import { buildMergeSplices } from './mergeImports.ts';

function rewriteSpecifier(sourceFile: ts.SourceFile, literal: ts.StringLiteralLike): Splice {
  const start = literal.getStart(sourceFile);
  const quote = sourceFile.text.slice(start, start + 1);

  return { start, end: literal.getEnd(), text: `${quote}${ROOT_PACKAGE_NAME}${quote}` };
}

function applySplices(code: string, splices: readonly Splice[]): string {
  return [...splices]
    .sort((a, b) => b.start - a.start)
    .reduce((text, splice) => text.slice(0, splice.start) + splice.text + text.slice(splice.end), code);
}

export function transformSource(code: string, fileName: string): TransformSourceResult {
  if (!code.includes(MOBILE_PACKAGE_NAME)) {
    return { code, changes: [], notes: [] };
  }

  const sourceFile = parseSource(code, fileName);
  const hits = collectSpecifiers(sourceFile);

  if (hits.length === 0) {
    return { code, changes: [], notes: [] };
  }

  const merge = buildMergeSplices(sourceFile, hits);

  const splices: Splice[] = [...merge.splices];
  const changes: SourceChange[] = [...merge.changes];

  for (const hit of hits) {
    if (hit.declaration !== undefined && merge.mergedDeclarations.has(hit.declaration)) {
      continue;
    }

    splices.push(rewriteSpecifier(sourceFile, hit.literal));
    changes.push({ line: lineOf(sourceFile, hit.literal.getStart(sourceFile)), kind: hit.kind });
  }

  return {
    code: applySplices(code, splices),
    changes: [...changes].sort((a, b) => a.line - b.line),
    notes: merge.notes,
  };
}
