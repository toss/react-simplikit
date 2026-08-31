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

- Node.js 22.17.0 or newer.
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
npx react-simplikit-codemod mobile-to-root --ignore '**/legacy/**' --ignore '**/e2e/**'
npx react-simplikit-codemod mobile-to-root --no-package-json
```

`--debug` adds a stack trace on failure. The command never prompts, so it is safe to run non-interactively and in CI.

## JSON output

`--json` writes only this object to stdout. Everything else goes to stderr.

```json
{
  "transform": "mobile-to-root",
  "dryRun": false,
  "scanned": 128,
  "changed": [
    {
      "file": "src/a.tsx",
      "changes": [{ "line": 3, "kind": "import" }],
      "dependencies": []
    },
    {
      "file": "package.json",
      "changes": [],
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
      "file": "package.json",
      "reason": "\"overrides\" still pins @react-simplikit/mobile..."
    }
  ]
}
```

`changes[].kind` is one of `import`, `export`, `require`, `dynamic-import`, `import-type`, `mock`, `merge`.

`dependencies[].added` is **omitted entirely** when the manifest already depended on `react-simplikit` — the codemod only removed the old entry. Read a missing key as "nothing was added".

## After the run

1. Act on every entry in `manual` by hand.
2. Reinstall so the lockfile drops the old package.
3. Require `react-simplikit@0.2.0` or newer — the first release re-exporting the `SafeAreaInset` type from the root entry.

## Failure handling

| Exit code | What to do                                                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2`       | The invocation was wrong. stderr names the bad path or flag. Fix it and rerun                                                                            |
| `1`       | Some files could not be processed. They are listed in `failed` (or under **Could not be processed**); every other file was migrated. Fix those and rerun |
| `0`       | Done. Review the diff                                                                                                                                    |
