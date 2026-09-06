# Contributing to react-simplikit

Welcome! We appreciate your interest in contributing to react-simplikit. This page is the short version; the full guide, including the JSDoc rules, SSR tests and the changeset flow, is the [Contributing Guide](https://react-simplikit.slash.page/contributing.html) on the documentation site.

## Every contribution needs

- **Implementation** — following the [Design Principles](https://react-simplikit.slash.page/design-principles.html)
- **Test code** — 100% coverage, including an SSR test
- **JSDoc** — the English documentation is generated from it (`yarn docs:gen <name>`)

## Scaffolding

```bash
yarn run scaffold <name> --type <type>
```

- `type`: `component`, `hook`, or `util` (shortcuts: `c`, `h`, `u`)
- `name`: name of the implementation

## Changesets

When your change affects the published package, add a changeset and commit it with your PR:

```bash
yarn changeset
```

The package is in the `0.x` stage, so most changes are `patch`. Ask a maintainer when unsure.

## Useful Links

- [Documentation Site](https://react-simplikit.slash.page)
- [Discord](https://discord.gg/vGXbVjP2nY) — community chat for questions and discussions
