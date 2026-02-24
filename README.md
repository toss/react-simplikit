![react-simplikit](./.vitepress/dist/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

English | [한국어](./README-ko_kr.md)

A collection of lightweight, zero-dependency React utilities for building robust applications.

## Packages

| Package                                      | Description                                                     | Version                                                                                                                   |
| -------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [react-simplikit](./packages/core)           | Universal hooks - pure state/logic hooks (platform-independent) | [![npm](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)                 |
| [@react-simplikit/mobile](./packages/mobile) | Mobile web utilities (viewport, keyboard, scroll)               | [![npm](https://img.shields.io/npm/v/@react-simplikit/mobile.svg)](https://www.npmjs.com/package/@react-simplikit/mobile) |

> **Note**: `react-simplikit` is now maintained as a Universal Hook Library providing only pure state/logic hooks that work across web and mobile (React Native). Browser/platform-dependent hooks are deprecated. See [packages/core/README.md](./packages/core/README.md) for details.

## Features

- **Zero dependencies** - Extremely lightweight
- **100% TypeScript** - Full type safety
- **100% Test coverage** - Reliable and stable
- **SSR-safe** - Works with Next.js and other SSR frameworks
- **Tree-shakeable** - Only bundle what you use

## Installation

```bash
# Core utilities
npm install react-simplikit

# Mobile web utilities
npm install @react-simplikit/mobile
```

## Quick Start

### react-simplikit

```tsx
import { useState, useEffect } from 'react';
import { useDebounce } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### @react-simplikit/mobile

```tsx
import { useAvoidKeyboard, useBodyScrollLock } from '@react-simplikit/mobile';

function ChatInput() {
  const { ref, style } = useAvoidKeyboard();

  return (
    <div ref={ref} style={style}>
      <input type="text" placeholder="Type a message..." />
    </div>
  );
}

function Modal({ isOpen }) {
  useBodyScrollLock(isOpen);
  // ...
}
```

## Documentation

Visit [react-simplikit.slash.page](https://react-simplikit.slash.page) for full documentation.

## Repository Structure

```
packages/
├── core/    # react-simplikit (hooks, components, utils)
└── mobile/  # @react-simplikit/mobile (mobile web utilities)
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
