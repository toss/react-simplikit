#!/usr/bin/env node
// Mechanical assertions for a run's output tree.
// Usage: node check_imports.mjs <outputs-dir> <public-exports.json>
// Prints JSON: { files, importedSymbols, badSpecifiers, unknownSymbols, usesDefaultImport, usesLibrary }

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const [, , outputsDir, exportsFile] = process.argv;
const publicExports = new Set(JSON.parse(readFileSync(exportsFile, 'utf8')));

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.md']);

function walk(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...walk(full));
    else if (CODE_EXTENSIONS.has(extname(entry))) found.push(full);
  }
  return found;
}

const files = walk(outputsDir);
const importedSymbols = new Set();
const badSpecifiers = [];
const unknownSymbols = new Set();
let usesDefaultImport = false;

// Any import statement whose specifier mentions react-simplikit, however written.
const IMPORT = /import\s+([^;]*?)\s+from\s+['"]([^'"]*react-simplikit[^'"]*)['"]/g;

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  for (const [, clause, specifier] of source.matchAll(IMPORT)) {
    if (specifier !== 'react-simplikit') badSpecifiers.push({ file, specifier });
    const named = clause.match(/\{([^}]*)\}/);
    const beforeBrace = clause
      .split('{')[0]
      .replace(/type\s*/, '')
      .trim();
    if (beforeBrace !== '' && beforeBrace !== ',') usesDefaultImport = true;
    if (named) {
      for (const raw of named[1].split(',')) {
        const name = raw
          .trim()
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)[0]
          .trim();
        if (name === '') continue;
        importedSymbols.add(name);
        if (!publicExports.has(name) && !publicExports.has(`type ${name}`)) unknownSymbols.add(name);
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      files: files.map(f => f.slice(outputsDir.length + 1)),
      usesLibrary: importedSymbols.size > 0 || badSpecifiers.length > 0,
      importedSymbols: [...importedSymbols].sort(),
      badSpecifiers,
      unknownSymbols: [...unknownSymbols].sort(),
      usesDefaultImport,
    },
    null,
    2
  )
);
