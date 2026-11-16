import type { Edit, SgNode, SgRoot } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import { useMetricAtom } from 'codemod:metrics';

import { createReport, findCalls, type Report } from '../utils/options.ts';

const manualReview = useMetricAtom('manual-review');

// #528: state hooks return [value, actions].
// const [open, setTrue, setFalse, toggle] = useBooleanState() → const [open, { setTrue, setFalse, toggle }] = useBooleanState()
// const [token, setToken, refresh] = useStorageState('token') → const [token, { setValue: setToken, refresh }] = …
// const { count, increment } = useCounter(0)                 → const [count, { increment }] = useCounter(0)
const TUPLE_HOOKS: Array<[hook: string, actions: string[]]> = [
  ['useBooleanState', ['setTrue', 'setFalse', 'toggle']],
  ['useStorageState', ['setValue', 'refresh']],
];

export default function transform(root: SgRoot<TSX>): string | null {
  const edits: Edit[] = [];

  for (const [hook, actions] of TUPLE_HOOKS) {
    const report = createReport(root, manualReview, hook);

    for (const pattern of destructuredPatterns(root, hook, report)) {
      if (pattern.kind() === 'array_pattern') {
        edits.push(...fromTuple(pattern, actions, report));
      } else {
        report(pattern, 'return-not-destructured');
      }
    }
  }

  const report = createReport(root, manualReview, 'useCounter');

  for (const pattern of destructuredPatterns(root, 'useCounter', report)) {
    if (pattern.kind() === 'object_pattern') {
      edits.push(...fromObject(pattern, report));
    } else if (pattern.kind() !== 'array_pattern') {
      report(pattern, 'return-not-destructured');
    }
  }

  return edits.length === 0 ? null : root.root().commitEdits(edits);
}

/** The left side of each `const <pattern> = hook()`; a call used any other way is reported. */
function destructuredPatterns(root: SgRoot<TSX>, hook: string, report: Report): SgNode<TSX>[] {
  return findCalls(root, hook, report).flatMap(call => {
    const declarator = call.parent();

    if (declarator?.kind() !== 'variable_declarator' || declarator.field('value')?.id() !== call.id()) {
      report(call, 'return-not-destructured');
      return [];
    }

    return [declarator.field('name')!];
  });
}

/** `[value, a, , c]` → `[value, { a, c }]`, naming each action by its position. */
function fromTuple(pattern: SgNode<TSX>, actions: string[], report: Report): Edit[] {
  const elements: Array<SgNode<TSX> | undefined> = [];
  let index = 0;

  for (const child of pattern.children()) {
    if (child.text() === ',') {
      index += 1;
    } else if (child.isNamed() && child.kind() !== 'comment') {
      elements[index] = child;
    }
  }

  const [value, ...rest] = elements;

  // `[value]` needs no change, and `[value, { … }]` is the v1 shape already.
  if (rest.every(element => element === undefined) || (rest.length === 1 && rest[0]?.kind() === 'object_pattern')) {
    return [];
  }

  if (elements.some(element => element?.kind() === 'rest_pattern' || element?.kind() === 'assignment_pattern')) {
    report(pattern, 'return-pattern-not-simple');
    return [];
  }

  const properties = rest.flatMap((element, i) => {
    const action = actions[i];

    if (element === undefined || action === undefined) {
      return [];
    }

    return [element.text() === action ? action : `${action}: ${element.text()}`];
  });

  return [pattern.replace(`[${value?.text() ?? ''}, { ${properties.join(', ')} }]`)];
}

/** `{ count, increment: inc }` → `[count, { increment: inc }]`. */
function fromObject(pattern: SgNode<TSX>, report: Report): Edit[] {
  let value = '';
  const actions: string[] = [];

  for (const property of pattern.children().filter(node => node.isNamed() && node.kind() !== 'comment')) {
    if (property.kind() === 'shorthand_property_identifier_pattern') {
      if (property.text() === 'count') {
        value = 'count';
      } else {
        actions.push(property.text());
      }
    } else if (property.kind() === 'pair_pattern' && property.field('key')?.kind() === 'property_identifier') {
      if (property.field('key')!.text() === 'count') {
        value = property.field('value')!.text();
      } else {
        actions.push(property.text());
      }
    } else {
      // A default, a rest element or a computed key.
      report(pattern, 'return-pattern-not-simple');
      return [];
    }
  }

  return [pattern.replace(actions.length === 0 ? `[${value}]` : `[${value}, { ${actions.join(', ')} }]`)];
}
