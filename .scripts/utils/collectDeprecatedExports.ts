import glob from 'fast-glob';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';

import { readDeprecation } from './jsdoc.ts';

/**
 * The given public exports whose own JSDoc is `@deprecated`, in the order given. Such an export has
 * no documentation page, so every check that expects one page per export leaves these out.
 *
 * Each source is found by name anywhere under `src/`, not through the path `generateSkill` derives
 * from `index.ts`, so the verify scripts do not repeat a mistake the generator makes.
 */
export async function collectDeprecatedExports(root: string, publicExports: string[]): Promise<string[]> {
  const deprecations = await Promise.all(
    publicExports.map(async name => {
      const [sourceFilePath] = await glob(`packages/react-simplikit/src/**/${name}.ts?(x)`, {
        absolute: true,
        cwd: root,
        ignore: ['**/*.spec.*', '**/*.test.*'],
      });

      assert.ok(sourceFilePath, `${name} is exported but has no source file`);

      return readDeprecation(await fs.readFile(sourceFilePath, 'utf8'));
    })
  );

  return publicExports.filter((_, index) => deprecations[index] != null);
}
