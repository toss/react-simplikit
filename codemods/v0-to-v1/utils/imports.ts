import type { SgNode, SgRoot } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';

const PACKAGE_NAME = 'react-simplikit';

export type ImportedBinding = {
  /** Local names bound by `import { name }` or `import { name as alias }`. */
  locals: string[];
  /** Namespace names bound by `import * as ns`, called as `ns.name(...)`. */
  namespaces: string[];
  /** `require('react-simplikit')` calls, which transforms do not follow. */
  requires: SgNode<TSX>[];
  /** `export { name } from 'react-simplikit'` and `export *` statements, whose importers transforms cannot see. */
  reexports: SgNode<TSX>[];
};

/**
 * Finds how `exportName` from react-simplikit is reachable in this file, so a transform only touches
 * calls that really come from the library and leaves a local function with the same name alone.
 */
export function findImportedBinding(root: SgRoot<TSX>, exportName: string): ImportedBinding {
  const binding: ImportedBinding = { locals: [], namespaces: [], requires: [], reexports: [] };

  for (const statement of root.root().findAll({ rule: { kind: 'import_statement' } })) {
    if (sourceOf(statement.field('source')) !== PACKAGE_NAME) {
      continue;
    }

    for (const specifier of statement.findAll({ rule: { kind: 'import_specifier' } })) {
      if (specifier.field('name')?.text() === exportName) {
        binding.locals.push((specifier.field('alias') ?? specifier.field('name'))!.text());
      }
    }

    for (const namespace of statement.findAll({ rule: { kind: 'namespace_import' } })) {
      const name = namespace.find({ rule: { kind: 'identifier' } })?.text();

      if (name !== undefined) {
        binding.namespaces.push(name);
      }
    }
  }

  for (const statement of root.root().findAll({ rule: { kind: 'export_statement' } })) {
    if (sourceOf(statement.field('source')) !== PACKAGE_NAME) {
      continue;
    }

    const exportsName = statement
      .findAll({ rule: { kind: 'export_specifier' } })
      .some(specifier => specifier.field('name')?.text() === exportName);

    // No export clause means `export * from` or `export * as ns from`, which also carries `exportName`.
    if (exportsName || statement.find({ rule: { kind: 'export_clause' } }) === null) {
      binding.reexports.push(statement);
    }
  }

  for (const call of root.root().findAll({ rule: { kind: 'call_expression' } })) {
    if (call.field('function')?.text() !== 'require' || sourceOf(call.field('arguments')) !== PACKAGE_NAME) {
      continue;
    }

    // `const { useToggle } = require(...)` cannot reach `exportName`, so it needs no review.
    const pattern = call.parent()?.kind() === 'variable_declarator' ? call.parent()?.field('name') : null;

    if (pattern?.kind() !== 'object_pattern' || new RegExp(`\\b${exportName}\\b`).test(pattern.text())) {
      binding.requires.push(call);
    }
  }

  return binding;
}

function sourceOf(node: SgNode<TSX> | null) {
  return node?.find({ rule: { kind: 'string_fragment' } })?.text();
}
