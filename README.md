![react-simplikit](./public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

English | [한국어](./README-ko_kr.md) | [日本語](./README-ja_jp.md) | [简体中文](./README-zh_hans.md) | [Español](./README-es.md)

A collection of lightweight, zero-dependency React utilities for building robust applications.

## Packages

| Package                                       | Description                                                                                                        | Version                                                                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| [react-simplikit](./packages/react-simplikit) | React hooks, components and utils: state and logic, browser events, and mobile web (keyboard, safe area, viewport) | [![npm](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)                 |
| [react-simplikit-codemod](./packages/codemod) | Codemods that rewrite a codebase for a `react-simplikit` upgrade                                                   | [![npm](https://img.shields.io/npm/v/react-simplikit-codemod.svg)](https://www.npmjs.com/package/react-simplikit-codemod) |

## Features

- **Zero dependencies** - Extremely lightweight
- **100% TypeScript** - Full type safety
- **100% Test coverage** - Reliable and stable
- **SSR-safe** - Works with Next.js and other SSR frameworks
- **Tree-shakeable** - Only bundle what you use

## Installation

```bash
npm install react-simplikit
```

## Quick Start

```tsx
import { useState } from 'react';
import { useDebounce } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // Actual API call
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="Enter search term"
    />
  );
}
```

The debounced function exposes `.cancel()`, and pending calls are cancelled automatically when the component unmounts.

### Keep a fixed element above the on-screen keyboard

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

function ChatInput() {
  const { style } = useAvoidKeyboard();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, ...style }}>
      <input type="text" placeholder="Type a message..." />
    </div>
  );
}
```

## Documentation

Visit [react-simplikit.slash.page](https://react-simplikit.slash.page) for full documentation.

## Repository Structure

```
packages/
├── react-simplikit/    # the library
├── codemod/            # react-simplikit-codemod
└── plugin/             # agent skill for AI coding assistants
```

## Contributing

We welcome contributions from everyone! Please check our contribution guide.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

MIT © Viva Republica, Inc. See [LICENSE](./LICENSE) for details.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
