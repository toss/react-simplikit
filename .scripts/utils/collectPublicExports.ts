import * as fs from 'node:fs/promises';

// `export type { ... }` never matches: the `type` keyword sits between `export` and `{`.
const VALUE_EXPORT_BLOCK = /export\s*\{([^}]*)\}\s*from/g;

/**
 * Names a package `index.ts` re-exports as values (`export { a, type B, c as d } from '...'`).
 * Type-only specifiers are dropped because they have no documentation page.
 */
export async function collectPublicExports(indexFilePath: string): Promise<string[]> {
  const source = await fs.readFile(indexFilePath, 'utf8');

  const names = [...source.matchAll(VALUE_EXPORT_BLOCK)]
    .flatMap(match => match[1].split(','))
    .map(specifier => specifier.trim())
    .filter(specifier => specifier !== '' && !specifier.startsWith('type '))
    .map(specifier => specifier.split(/\s+as\s+/).at(-1) ?? specifier);

  return [...new Set(names)].toSorted();
}
