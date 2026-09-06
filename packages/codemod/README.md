# react-simplikit-codemod

[![npm version](https://img.shields.io/npm/v/react-simplikit-codemod.svg)](https://www.npmjs.com/package/react-simplikit-codemod)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)

Codemods for migrating between `react-simplikit` entry points.

## `mobile-to-root`

`@react-simplikit/mobile` was absorbed into the `react-simplikit` root entry. This transform rewrites every import of the old package to the root entry, and folds the bindings into an existing `react-simplikit` import when the file already has one and merging cannot change what a name binds.

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
- A source file that names the package where no import could be rewritten — a `moduleNameMapper` entry, say. It is reported so you can check it by hand
- `resolutions` and `overrides` in `package.json` — reported, not edited, because their meaning differs per package manager
- Imports it will not fold into an existing `react-simplikit` import — the specifier is rewritten in place instead:
  - a comment sits on the import's own line, where merging would strand it — **reported**
  - the local name already refers to a different symbol, where merging would change what the name binds — **reported**
  - the import sits inside a `declare module` block, or binds a default or namespace — not reported, because merging it by hand fails to compile rather than passing quietly
- Your lockfile. Reinstall after the run

`node_modules`, `dist`, `build`, `out`, `coverage`, `.next`, `.yarn`, `.git` and `.pnp.*` are always skipped. Every other dot directory — `.storybook`, `.config` — is scanned.

### Options

| Flag                | Meaning                                                                         |
| ------------------- | ------------------------------------------------------------------------------- |
| `--dry-run`         | Report what would change without writing anything                               |
| `--json`            | Print a machine-readable report to stdout and nothing else                      |
| `--no-package-json` | Leave `package.json` dependency fields alone                                    |
| `--ignore <glob>`   | Skip an extra glob, relative to the current directory. Repeat for more than one |
| `--debug`           | Include stack traces in the report and on stderr                                |

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
npm install
```

The codemod already wrote the dependency and its version range, so a bare reinstall is enough — `npm install react-simplikit` would overwrite that range with whatever is newest.

Then run your formatter or linter fix on the changed files. The specifier moved from `@react-simplikit/mobile` to `react-simplikit`, and import-order rules such as `import/order` or `simple-import-sort` place the two differently, so an import that was sorted before the run is usually out of order after it.

One import needs a version floor: `SafeAreaInset` is only re-exported from the root entry in `react-simplikit@0.2.0` and later. An existing range is kept only when every version it admits sits on or above that floor; `^0.1.0`, `>=0.1.0` and `*` are raised to `^0.2.0`, because a lockfile could keep an older version under them. A `workspace:`, `catalog:` or `file:` protocol is kept as-is and reported instead, since only you know what it should point at.
