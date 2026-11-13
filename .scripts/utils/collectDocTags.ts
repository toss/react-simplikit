import glob from 'fast-glob';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';

import { readDeprecation, readNoDocs } from './jsdoc.ts';

export type DocTags = {
  /** Exports whose own JSDoc is `@deprecated`. They keep a page unless they are also `@no-docs`. */
  deprecated: string[];
  /**
   * Exports whose own JSDoc is `@no-docs`. They have no page, no `llms.txt` entry and no row in the
   * skill's category tables; one that is also `@deprecated` still gets an unlinked Deprecated row.
   */
  noDocs: string[];
};

/**
 * The given public exports that carry `@deprecated` or `@no-docs` on their own JSDoc, each list in
 * the order given.
 *
 * Each source is found by name anywhere under `src/`, not through the path `generateSkill` derives
 * from `index.ts`, so the verify scripts do not repeat a mistake the generator makes. `_internal`
 * is skipped because it holds implementations named after the public hooks that wrap them
 * (`hooks/_internal/useDebounce/useDebounce.ts`), and glob order would decide which one is read.
 */
export async function collectDocTags(root: string, publicExports: string[]): Promise<DocTags> {
  const sources = await Promise.all(
    publicExports.map(async name => {
      const [sourceFilePath] = await glob(`packages/react-simplikit/src/**/${name}.ts?(x)`, {
        absolute: true,
        cwd: root,
        ignore: ['**/*.spec.*', '**/*.test.*', '**/_internal/**'],
      });

      assert.ok(sourceFilePath, `${name} is exported but has no source file`);

      return fs.readFile(sourceFilePath, 'utf8');
    })
  );

  return {
    deprecated: publicExports.filter((_, index) => readDeprecation(sources[index]) != null),
    noDocs: publicExports.filter((_, index) => readNoDocs(sources[index])),
  };
}
