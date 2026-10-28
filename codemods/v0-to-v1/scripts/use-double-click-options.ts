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
  const { locals, namespaces } = findImportedBinding(root, 'useDoubleClick');

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
      manualReview.increment({ hook: 'useDoubleClick', reason: 'options-not-inline', file: root.relativeFilename() });
      continue;
    }

    for (const property of options.children()) {
      edits.push(...renameProperty(property));

      if (property.kind() === 'spread_element') {
        manualReview.increment({ hook: 'useDoubleClick', reason: 'options-spread', file: root.relativeFilename() });
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

  if (property.kind() === 'pair') {
    const key = property.field('key');
    const renamed = key?.kind() === 'property_identifier' ? RENAMED_KEYS[key.text()] : undefined;

    return key === null || renamed === undefined ? [] : [key.replace(renamed)];
  }

  return [];
}
