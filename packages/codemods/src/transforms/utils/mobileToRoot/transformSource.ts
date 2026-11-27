import { collectSpecifiers, lineOf, parseSource } from './collectSpecifiers.ts';
import { MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME } from './constants.ts';
import { buildMergeSplices } from './mergeImports.ts';
import type { Span, Splice, TransformSourceResult } from './types.ts';

function rewriteSpecifier(code: string, literal: Span): Splice {
  const quote = code.slice(literal.start, literal.start + 1);

  return { start: literal.start, end: literal.end, text: `${quote}${ROOT_PACKAGE_NAME}${quote}` };
}

function applySplices(code: string, splices: readonly Splice[]) {
  return splices
    .toSorted((a, b) => b.start - a.start)
    .reduce((text, splice) => text.slice(0, splice.start) + splice.text + text.slice(splice.end), code);
}

export function transformSource(code: string, fileName: string): TransformSourceResult {
  if (!code.includes(MOBILE_PACKAGE_NAME)) {
    return { code, notes: [] };
  }

  const parsed = parseSource(code, fileName);
  const hits = collectSpecifiers(parsed);
  const merge = buildMergeSplices(parsed, hits);
  const rewrites = hits.filter(hit => hit.declaration === undefined || !merge.mergedDeclarations.has(hit.declaration));
  const output = applySplices(code, [...merge.splices, ...rewrites.map(hit => rewriteSpecifier(code, hit.literal))]);
  const leftover = output.indexOf(MOBILE_PACKAGE_NAME);

  if (leftover === -1) {
    return { code: output, notes: merge.notes };
  }

  return {
    code: output,
    notes: [
      ...merge.notes,
      {
        line: lineOf(output, leftover),
        reason: `This file names ${MOBILE_PACKAGE_NAME} somewhere it could not be rewritten as an import. Check it by hand.`,
      },
    ],
  };
}
