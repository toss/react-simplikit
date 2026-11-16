import type { SgNode, SgRoot } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import { useMetricAtom } from 'codemod:metrics';

import { callArguments, createReport, findCalls, renameObjectKeys } from '../utils/options.ts';

const manualReview = useMetricAtom('manual-review');

// useInterval(fn, 1000)               → useInterval({ onTick: fn, delayMs: 1000 })
// useInterval(fn, { delay: 1000, … }) → useInterval({ onTick: fn, delayMs: 1000, … })
// useTimeout(fn, 1000)                → useTimeout({ onTimeout: fn, delayMs: 1000 })
export default function transform(root: SgRoot<TSX>): string | null {
  const edits = [
    ...wrapArguments(root, 'useInterval', 'onTick', true),
    ...wrapArguments(root, 'useTimeout', 'onTimeout', false),
  ];

  return edits.length === 0 ? null : root.root().commitEdits(edits);
}

function wrapArguments(root: SgRoot<TSX>, hook: string, callbackKey: string, delayRequired: boolean) {
  const report = createReport(root, manualReview, hook);

  return findCalls(root, hook, report).flatMap(call => {
    const [callback, delay, ...rest] = callArguments(call);

    // A single object is the v1 shape already.
    if (
      callback === undefined ||
      callback.kind() === 'object' ||
      rest.length > 0 ||
      (delayRequired && delay === undefined)
    ) {
      return [];
    }

    const callbackProperty = `${callbackKey}: ${callback.text()}`;
    const args = call.field('arguments')!;

    if (delay === undefined) {
      return [args.replace(`({ ${callbackProperty} })`)];
    }

    if (delay.kind() === 'object' && delayRequired) {
      const object = delay.commitEdits(renameObjectKeys(delay, { delay: 'delayMs' }, report));
      const first = delay.child(1)!;
      // Keep a multi-line object multi-line, indented like its first property.
      const separator =
        first.range().start.line === delay.range().start.line
          ? ' '
          : `\n${root.root().text().split('\n')[first.range().start.line].match(/^\s*/)![0]}`;

      return [args.replace(`({${separator}${callbackProperty},${object.slice(1)})`)];
    }

    if (isNumber(root, delay)) {
      return [args.replace(`({ ${callbackProperty}, delayMs: ${delay.text()} })`)];
    }

    // A variable may hold either a number or v0's options object.
    report(delay, 'delay-not-inline');
    return [];
  });
}

const ARITHMETIC = ['+', '-', '*', '/', '%', '**'];

/** Whether `node` is a number: a literal, arithmetic on numbers, or a constant in this file holding one. */
function isNumber(root: SgRoot<TSX>, node: SgNode<TSX>): boolean {
  switch (node.kind()) {
    case 'number':
      return true;
    case 'parenthesized_expression':
      return node.child(1) !== null && isNumber(root, node.child(1)!);
    case 'unary_expression':
    case 'binary_expression':
      return ARITHMETIC.includes(node.field('operator')?.text() ?? '');
    case 'identifier': {
      const declarator = root.root().find({
        rule: { kind: 'variable_declarator', has: { field: 'name', regex: `^${node.text()}$` } },
      });
      const value = declarator?.field('value');

      return value !== null && value !== undefined && isNumber(root, value);
    }
    default:
      return false;
  }
}
