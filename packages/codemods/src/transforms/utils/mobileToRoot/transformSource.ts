import { collectSpecifiers, lineOf, parseSource } from './collectSpecifiers.ts';
import { MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME } from './constants.ts';
import { buildMergeSplices } from './mergeImports.ts';
import type { SourceChange, Span, Splice, TransformSourceResult } from './types.ts';

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
    return { code, changes: [], notes: [] };
  }

  const parsed = parseSource(code, fileName);
  const hits = collectSpecifiers(parsed);

  if (hits.length === 0) {
    return {
      code,
      changes: [],
      notes: [
        {
          line: lineOf(code, code.indexOf(MOBILE_PACKAGE_NAME)),
          reason: `This file names ${MOBILE_PACKAGE_NAME} somewhere it could not be rewritten as an import. Check it by hand.`,
        },
      ],
    };
  }

  const merge = buildMergeSplices(parsed, hits);
  const rewrites = hits.filter(hit => hit.declaration === undefined || !merge.mergedDeclarations.has(hit.declaration));

  const splices = [...merge.splices, ...rewrites.map(hit => rewriteSpecifier(code, hit.literal))];
  const changes: SourceChange[] = [
    ...merge.changes,
    ...rewrites.map(hit => ({ line: lineOf(code, hit.literal.start), kind: hit.kind })),
  ];

  return {
    code: applySplices(code, splices),
    changes: changes.toSorted((a, b) => a.line - b.line),
    notes: merge.notes,
  };
}
