---
name: react-simplikit-codemod
description: Migrates a codebase off the deprecated @react-simplikit/mobile package onto the react-simplikit root entry. Use when a project still imports @react-simplikit/mobile, when an install warns that the package is deprecated, or when someone asks how to migrate off it.
license: MIT
metadata:
  author: toss
---

# react-simplikit-codemod

## When to use this

The project imports `@react-simplikit/mobile`, which is deprecated. Every export of that package now ships from the `react-simplikit` root entry.

Do **not** run this when the project has no `@react-simplikit/mobile` dependency, or when the user only asked a question about the migration — answer from this file instead.

## Preconditions

- The working tree is committed or stashed. This command rewrites files in place and has no undo of its own.

## Commands

Preview first — this writes nothing:

```bash
npx react-simplikit-codemod mobile-to-root --dry-run --json
```

Apply:

```bash
npx react-simplikit-codemod mobile-to-root
```

Limit it to one directory:

```bash
npx react-simplikit-codemod mobile-to-root src
```

Skip paths, or leave manifests alone:

```bash
npx react-simplikit-codemod mobile-to-root --ignore 'legacy/**' --ignore '**/e2e/**'
npx react-simplikit-codemod mobile-to-root --no-package-json
```

`--debug` puts stack traces in the report and on stderr, including for files that could not be processed. The command never prompts and is safe to run twice, so it fits non-interactive and CI use.

## JSON output

`--json` writes only this object to stdout. Everything else goes to stderr.

```json
{
  "transform": "mobile-to-root",
  "dryRun": false,
  "scanned": 128,
  "changed": [
    {
      "kind": "source",
      "file": "src/a.tsx",
      "changes": [{ "line": 3, "kind": "import" }]
    },
    {
      "kind": "manifest",
      "file": "package.json",
      "dependencies": [
        {
          "field": "dependencies",
          "removed": "@react-simplikit/mobile",
          "added": "^0.2.0"
        }
      ]
    }
  ],
  "manual": [
    {
      "file": "src/a.tsx",
      "line": 4,
      "reason": "Left on its own line: `isIOS` already refers to a different import here..."
    },
    {
      "file": "package.json",
      "reason": "\"overrides\" still pins @react-simplikit/mobile..."
    }
  ],
  "failed": []
}
```

The object always carries these six keys.

`changed[].kind` is `source` or `manifest`, and it decides the rest of the entry: a `source` entry carries `changes`, a `manifest` entry carries `dependencies`. Neither key appears on the other kind, so branch on `kind` rather than testing an array for emptiness.

`changes[].kind` is one of `import`, `export`, `require`, `dynamic-import`, `import-type`, `mock`, `merge`.

`dependencies[].added` is `null` in two cases: the existing `react-simplikit` range already satisfies the floor and was left as it was, or no registry range could be written at all because the old dependency was pinned by a `workspace:`/`catalog:`/`file:` protocol. The second case always carries a `manual` note naming the field.

`manual[].line` is present only for a note about a specific import; manifest notes have no line.

`failed[]` holds the files that could not be read, parsed, or written. It is always present and usually empty.

## After the run

1. Act on every entry in `manual` by hand. Entries with a `line` mark an import the codemod deliberately left on its own — read the reason before merging it yourself, because merging it by hand can change what a name binds.
2. Run a bare `npm install` (or the equivalent) so the lockfile drops the old package. Do not run `npm install react-simplikit` — it would overwrite the range the codemod just wrote.
3. Require `react-simplikit@0.2.0` or newer — the first release re-exporting the `SafeAreaInset` type from the root entry. An existing range below that floor is raised automatically; a `workspace:`/`catalog:`/`file:` protocol is kept and reported instead.

## Failure handling

| Exit code | What to do                                                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2`       | The invocation was wrong. stderr names the bad path or flag. Fix it and rerun                                                                            |
| `1`       | Some files could not be processed. They are listed in `failed` (or under **Could not be processed**); every other file was migrated. Fix those and rerun |
| `0`       | Done. Review the diff                                                                                                                                    |
