import type { SgRoot } from 'codemod:ast-grep';
import type TSX from 'codemod:ast-grep/langs/tsx';

const PACKAGE_NAME = 'react-simplikit';

export type ImportedBinding = {
  /** Local names bound by `import { name }` or `import { name as alias }`. */
  locals: string[];
  /** Namespace names bound by `import * as ns`, called as `ns.name(...)`. */
  namespaces: string[];
};

/**
 * Finds how `exportName` from react-simplikit is reachable in this file, so a transform only touches
 * calls that really come from the library and leaves a local function with the same name alone.
 */
export function findImportedBinding(root: SgRoot<TSX>, exportName: string): ImportedBinding {
  const binding: ImportedBinding = { locals: [], namespaces: [] };

  for (const statement of root.root().findAll({ rule: { kind: 'import_statement' } })) {
    if (
      statement
        .field('source')
        ?.find({ rule: { kind: 'string_fragment' } })
        ?.text() !== PACKAGE_NAME
    ) {
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

  return binding;
}
