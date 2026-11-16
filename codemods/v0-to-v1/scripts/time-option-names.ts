import type { Edit, SgRoot } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import { useMetricAtom } from 'codemod:metrics';

import { findImportedBinding } from '../utils/imports.ts';
import { createReport, isBinding, renameOptionKeys } from '../utils/options.ts';

const manualReview = useMetricAtom('manual-review');

// #536: time options carry their unit, as in `{ timeThreshold }` → `{ debounceMs }`.
const HOOKS: Array<[hook: string, argument: number, keys: Record<string, string>]> = [
  ['useDebouncedCallback', 0, { timeThreshold: 'debounceMs' }],
  ['useThrottledCallback', 0, { timeThreshold: 'throttleMs' }],
  ['useImpressionRef', 0, { timeThreshold: 'timeThresholdMs' }],
  ['useLongPress', 1, { delay: 'delayMs' }],
  ['useAvoidKeyboard', 0, { transitionDuration: 'transitionDurationMs' }],
];

export default function transform(root: SgRoot<TSX>): string | null {
  const edits: Edit[] = HOOKS.flatMap(([hook, argument, keys]) =>
    renameOptionKeys(root, manualReview, hook, argument, keys)
  );

  // <ImpressionArea timeThreshold={500}> → <ImpressionArea timeThresholdMs={500}>
  const report = createReport(root, manualReview, 'ImpressionArea');
  const { locals, namespaces, requires, reexports } = findImportedBinding(root, 'ImpressionArea');

  requires.forEach(node => report(node, 'require-not-followed'));
  reexports.forEach(node => report(node, 're-exported'));

  // The `typescript` grammar that parses .ts files has no JSX node kinds and throws on them.
  const elements = /\.[cm]?ts$/.test(root.filename())
    ? []
    : root.root().findAll({ rule: { any: [{ kind: 'jsx_opening_element' }, { kind: 'jsx_self_closing_element' }] } });

  for (const element of elements) {
    if (!isBinding(element.field('name'), 'ImpressionArea', locals, namespaces)) {
      continue;
    }

    for (const attribute of element.children()) {
      if (attribute.kind() === 'jsx_expression') {
        // `{...props}` may hold `timeThreshold`.
        report(attribute, 'props-spread');
      }

      const name = attribute.kind() === 'jsx_attribute' ? attribute.child(0) : null;

      if (name?.text() === 'timeThreshold') {
        edits.push(name.replace('timeThresholdMs'));
      }
    }
  }

  return edits.length === 0 ? null : root.root().commitEdits(edits);
}
