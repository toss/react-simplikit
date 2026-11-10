import type { Edit, SgNode, SgRoot } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import { useMetricAtom } from 'codemod:metrics';

import { findImportedBinding } from '../utils/imports.ts';

// #535: useDoubleClick({ click, doubleClick, delay }) → useDoubleClick({ onClick, onDoubleClick, delayMs })
const RENAMED_KEYS: Record<string, string> = {
  click: 'onClick',
  doubleClick: 'onDoubleClick',
  delay: 'delayMs',
};

const manualReview = useMetricAtom('manual-review');

export default function transform(root: SgRoot<TSX>): string | null {
  const { locals, namespaces, requires, reexports } = findImportedBinding(root, 'useDoubleClick');
  const report = (node: SgNode<TSX>, reason: string) =>
    manualReview.increment({
      hook: 'useDoubleClick',
      reason,
      file: root.relativeFilename(),
      line: String(node.range().start.line + 1),
    });

  requires.forEach(node => report(node, 'require-not-followed'));
  reexports.forEach(node => report(node, 're-exported'));

  if (locals.length === 0 && namespaces.length === 0) {
    return null;
  }

  const edits: Edit[] = [];

  for (const call of root.root().findAll({ rule: { kind: 'call_expression' } })) {
    if (!isUseDoubleClick(call.field('function'), locals, namespaces)) {
      continue;
    }

    const options = call.field('arguments')?.child(1);

    if (options?.kind() !== 'object') {
      // The options come from a variable or a spread we cannot see into.
      report(call, 'options-not-inline');
      continue;
    }

    for (const property of options.children()) {
      edits.push(...renameProperty(property));

      if (property.kind() === 'spread_element') {
        report(property, 'options-spread');
      }

      if (propertyKey(property)?.kind() === 'computed_property_name') {
        report(property, 'options-computed-key');
      }
    }
  }

  return edits.length === 0 ? null : root.root().commitEdits(edits);
}

function isUseDoubleClick(callee: SgNode<TSX> | null, locals: string[], namespaces: string[]) {
  if (callee?.kind() === 'identifier') {
    return locals.includes(callee.text());
  }

  return (
    callee?.kind() === 'member_expression' &&
    namespaces.includes(callee.field('object')?.text() ?? '') &&
    callee.field('property')?.text() === 'useDoubleClick'
  );
}

function renameProperty(property: SgNode<TSX>): Edit[] {
  if (property.kind() === 'shorthand_property_identifier') {
    const renamed = RENAMED_KEYS[property.text()];

    return renamed === undefined ? [] : [property.replace(`${renamed}: ${property.text()}`)];
  }

  const key = propertyKey(property);
  const name = key?.kind() === 'string' ? key.find({ rule: { kind: 'string_fragment' } })?.text() : key?.text();
  const renamed = name === undefined ? undefined : RENAMED_KEYS[name];

  return key === null || renamed === undefined ? [] : [key.replace(renamed)];
}

// `{ click: fn }` and `{ 'click': fn }` keep the key in `key`, `{ click() {} }` in `name`.
function propertyKey(property: SgNode<TSX>) {
  return property.field('key') ?? property.field('name');
}
