#!/usr/bin/env node
// Regenerates public-exports.json from the package barrel, so check_imports.mjs never runs
// against a hand-maintained list. Type-only exports are kept with a `type ` prefix.
//
// Usage: collect_public_exports.mjs [path/to/src/index.ts] > public-exports.json
import { readFileSync } from 'node:fs';

const barrel = process.argv[2] ?? new URL('../../packages/react-simplikit/src/index.ts', import.meta.url).pathname;
const source = readFileSync(barrel, 'utf8');
const names = new Set();
for (const statement of source.matchAll(/export\s+(type\s+)?\{([^}]*)\}/g)) {
  for (const raw of statement[2].split(',')) {
    let name = raw.trim();
    if (name === '') continue;
    const isType = /^type\s+/.test(name) || Boolean(statement[1]);
    name = name
      .replace(/^type\s+/, '')
      .split(/\s+as\s+/)
      .pop()
      .trim();
    names.add(isType ? `type ${name}` : name);
  }
}
console.log(JSON.stringify([...names].sort(), null, 2));
