# react-simplikit-codemod

[![npm version](https://img.shields.io/npm/v/react-simplikit-codemod.svg)](https://www.npmjs.com/package/react-simplikit-codemod)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)

Codemods for migrating between `react-simplikit` entry points.

## `mobile-to-root`

`@react-simplikit/mobile` was absorbed into the `react-simplikit` root entry. This transform rewrites every import of the old package to the root package and, where it can, folds the bindings into an import you already have.

```bash
npx react-simplikit-codemod mobile-to-root
```

The command rewrites files in place and never prompts. **Commit or stash your work first**, then review the diff. Preview without writing anything:

```bash
npx react-simplikit-codemod mobile-to-root --dry-run
```

### What it changes

- `import`, `import type`, `import * as ns`, and side-effect imports
- `export ... from` and `export * from`
- `require('@react-simplikit/mobile')`, `require.resolve`, `import m = require(...)`, and `await import('@react-simplikit/mobile')`
- `import('@react-simplikit/mobile').SafeAreaInset` in type position
- `vi.mock` / `vi.importActual` / `jest.mock` / `jest.requireActual` module arguments
- `dependencies`, `devDependencies`, `peerDependencies` and `optionalDependencies` in every `package.json` it finds

Source files are parsed with the TypeScript compiler and edited by offset, so formatting, comments and quote style survive untouched. `package.json` is the exception: it is reparsed and reserialized, which normalizes line endings and collapses any hand formatting.

### What it leaves alone

- Markdown, MDX, comments, and any other prose naming the package
- `resolutions` and `overrides` in `package.json` — reported, not edited, because their meaning differs per package manager
- Imports carrying a comment, sitting inside a `declare module` block, or whose local name is already bound to a different symbol: merging would lose something, so the specifier is rewritten in place instead. The first two are reported so you do not merge them by hand and reintroduce what the codemod avoided
- Your lockfile. Reinstall after the run

`node_modules`, `dist`, `build`, `out`, `coverage`, `.next`, `.yarn` and `.git` are always skipped.

### Options

| Flag                | Meaning                                                    |
| ------------------- | ---------------------------------------------------------- |
| `--dry-run`         | Report what would change without writing anything          |
| `--json`            | Print a machine-readable report to stdout and nothing else |
| `--no-package-json` | Leave `package.json` dependency fields alone               |
| `--ignore <glob>`   | Skip an extra glob. Repeat for more than one               |
| `--debug`           | Print the stack trace when the run fails                   |

### Exit codes

| Code | Meaning                                                                   |
| ---- | ------------------------------------------------------------------------- |
| `0`  | Success, including "nothing to change"                                    |
| `1`  | The invocation was valid but a file could not be read, parsed, or written |
| `2`  | Invalid usage: unknown command, bad flag, or a path that does not exist   |

A run is not atomic and does not stop at the first failure. On exit `1` the report lists every file it could not process under **Could not be processed**; everything else was migrated.

Running it twice is safe: the second run finds nothing to change.

### After running

```bash
npm install react-simplikit && npm install
```

One import needs a version floor: `SafeAreaInset` is only re-exported from the root entry in `react-simplikit@0.2.0` and later.
