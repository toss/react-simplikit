import type { Edit, SgNode, SgRoot } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';
import type { useMetricAtom } from 'codemod:metrics';

import { findImportedBinding } from './imports.ts';

export type ManualReview = ReturnType<typeof useMetricAtom>;

export type Report = (node: SgNode<TSX>, reason: string) => void;

/** Reports a node under `manual-review` with the hook, reason, file and line. */
export function createReport(root: SgRoot<TSX>, manualReview: ManualReview, hook: string): Report {
  return (node, reason) =>
    manualReview.increment({
      hook,
      reason,
      file: root.relativeFilename(),
      line: String(node.range().start.line + 1),
    });
}

/**
 * Finds every call of `exportName` from react-simplikit, including aliased and namespace imports, and
 * reports the `require` calls and re-exports it cannot follow.
 */
export function findCalls(root: SgRoot<TSX>, exportName: string, report: Report): SgNode<TSX>[] {
  const { locals, namespaces, requires, reexports } = findImportedBinding(root, exportName);

  requires.forEach(node => report(node, 'require-not-followed'));
  reexports.forEach(node => report(node, 're-exported'));

  return root
    .root()
    .findAll({ rule: { kind: 'call_expression' } })
    .filter(call => isBinding(call.field('function'), exportName, locals, namespaces));
}

/** Whether `node` names `exportName` through a local import (`useToggle`) or a namespace (`simplikit.useToggle`). */
export function isBinding(node: SgNode<TSX> | null, exportName: string, locals: string[], namespaces: string[]) {
  if (node?.kind() === 'identifier') {
    return locals.includes(node.text());
  }

  return (
    (node?.kind() === 'member_expression' || node?.kind() === 'nested_identifier') &&
    namespaces.includes(node.field('object')?.text() ?? '') &&
    node.field('property')?.text() === exportName
  );
}

/** The call's arguments without the parentheses, commas and comments. */
export function callArguments(call: SgNode<TSX>): SgNode<TSX>[] {
  return (
    call
      .field('arguments')
      ?.children()
      .filter(node => node.isNamed() && node.kind() !== 'comment') ?? []
  );
}

/**
 * Renames option keys in every inline options object passed as argument `argument` of `hook`, and reports
 * options it cannot see into.
 */
export function renameOptionKeys(
  root: SgRoot<TSX>,
  manualReview: ManualReview,
  hook: string,
  argument: number,
  keys: Record<string, string>
): Edit[] {
  const report = createReport(root, manualReview, hook);

  return findCalls(root, hook, report).flatMap(call => {
    const options = callArguments(call)[argument];

    if (options === undefined) {
      return [];
    }

    if (options.kind() !== 'object') {
      report(call, 'options-not-inline');
      return [];
    }

    return renameObjectKeys(options, keys, report);
  });
}

/** Renames `keys` in an object literal and reports spreads and computed keys, which may hold an old key. */
export function renameObjectKeys(object: SgNode<TSX>, keys: Record<string, string>, report: Report): Edit[] {
  const edits: Edit[] = [];

  for (const property of object.children()) {
    if (property.kind() === 'spread_element') {
      report(property, 'options-spread');
      continue;
    }

    if (property.kind() === 'shorthand_property_identifier') {
      const renamed = keys[property.text()];

      if (renamed !== undefined) {
        edits.push(property.replace(`${renamed}: ${property.text()}`));
      }

      continue;
    }

    const key = propertyKey(property);

    if (key?.kind() === 'computed_property_name') {
      report(property, 'options-computed-key');
      continue;
    }

    const renamed = keys[propertyName(key) ?? ''];

    if (key !== null && renamed !== undefined) {
      edits.push(key.replace(renamed));
    }
  }

  return edits;
}

/** `{ click: fn }` and `{ 'click': fn }` keep the key in `key`, `{ click() {} }` in `name`. */
export function propertyKey(property: SgNode<TSX>) {
  return property.field('key') ?? property.field('name');
}

/** The key's name, without the quotes of a string key. */
export function propertyName(key: SgNode<TSX> | null) {
  return key?.kind() === 'string' ? key.find({ rule: { kind: 'string_fragment' } })?.text() : key?.text();
}
