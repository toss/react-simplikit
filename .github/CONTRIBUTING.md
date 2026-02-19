# Contributing to react-simplikit

Welcome! We appreciate your interest in contributing to react-simplikit. This document provides an overview of how to contribute. For detailed guidelines, please refer to the package-specific contributing guides linked below.

## Contributing Guide

Each contribution requires:

- **Implementation** — following our [Design Principles](https://react-simplikit.slash.page/core/design-principles.html)
- **Test Code** — 100% coverage required
- **JSDoc** — documentation is auto-generated from JSDoc, so no separate docs needed

For detailed instructions, see the package-specific guides:

- [Core Package Contributing Guide](../docs/core/contributing.md)
- [Mobile Package Contributing Guide](../docs/mobile/contributing.md)

## Scaffolding

Use the scaffold command to create a basic structure for new implementations:

```bash
yarn run scaffold <name> --type <type>
```

- `type`: `component`, `hook`, or `util` (shortcuts: `c`, `h`, `u`)
- `name`: Name of the implementation

## Creating a Changeset

When your changes affect a package, create a changeset:

```bash
yarn changeset
```

Select the version bump type (`patch`, `minor`, or `major`).

> **Note:** Both packages are currently in the `0.0.x` stage. During this phase, most changes should use `patch`. If you're unsure about the version type, please discuss with the maintainers.

## Useful Links

- [Documentation Site](https://react-simplikit.slash.page)
- [Design Principles](https://react-simplikit.slash.page/core/design-principles.html)
- [Discord](https://discord.gg/vGXbVjP2nY)
