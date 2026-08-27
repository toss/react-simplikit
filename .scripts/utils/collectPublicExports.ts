import * as fs from 'node:fs/promises';

export type PublicExportEntry = {
  name: string;
  /** Module specifier as written in the index file, e.g. `./hooks/useToggle/index.ts`. */
  sourcePath: string;
};

// `export type { ... }` never matches: the `type` keyword sits between `export` and `{`.
const VALUE_EXPORT_BLOCK = /export\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g;

/**
 * Value exports of a package `index.ts` (`export { a, type B, c as d } from '...'`) paired with the
 * module each comes from, sorted by name. Type-only specifiers are dropped because they have no
 * documentation page; a name exported twice keeps its first source.
 */
export async function collectPublicExportEntries(indexFilePath: string): Promise<PublicExportEntry[]> {
  const source = await fs.readFile(indexFilePath, 'utf8');
  const entries = new Map<string, PublicExportEntry>();

  for (const match of source.matchAll(VALUE_EXPORT_BLOCK)) {
    const names = match[1]
      .split(',')
      .map(specifier => specifier.trim())
      .filter(specifier => specifier !== '' && !specifier.startsWith('type '))
      .map(specifier => specifier.split(/\s+as\s+/).at(-1) ?? specifier);

    for (const name of names) {
      if (!entries.has(name)) {
        entries.set(name, { name, sourcePath: match[2] });
      }
    }
  }

  return [...entries.values()].toSorted(compareByName);
}

/**
 * Names a package `index.ts` re-exports as values, sorted.
 */
export async function collectPublicExports(indexFilePath: string): Promise<string[]> {
  return (await collectPublicExportEntries(indexFilePath)).map(entry => entry.name);
}

function compareByName(a: PublicExportEntry, b: PublicExportEntry): number {
  if (a.name === b.name) {
    return 0;
  }

  return a.name < b.name ? -1 : 1;
}
