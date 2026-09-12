# react-simplikit

[![npm version](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

English | [한국어](./README-ko_kr.md) | [日本語](./README-ja_jp.md) | [简体中文](./README-zh_hans.md) | [Español](./README-es.md)

A lightweight, zero-dependency React utilities library providing hooks, components, and utilities.

## Features

- **Zero dependencies** - Extremely lightweight
- **100% TypeScript** - Full type safety
- **100% Test coverage** - Reliable and stable
- **SSR-safe** - Works with Next.js and other SSR frameworks
- **Tree-shakeable** - Only bundle what you use

## Installation

```bash
npm install react-simplikit
# or
yarn add react-simplikit
# or
pnpm add react-simplikit
```

## Quick Start

Use `useDebounce` to call your search function after the user stops typing for 300 ms. In this example, `searchAPI` is the search function provided by your application.

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

## What's Included

- **Hooks** — state and logic (`useToggle`, `useDebounce`, `useList`, …), browser events (`useIntersectionObserver`, `useOutsideClickEffect`, …) and mobile web (`useAvoidKeyboard`, `useSafeAreaInset`, `useVisualViewport`, …)
- **Components** — `SwitchCase`, `Separated`, `ImpressionArea`
- **Utils** — `buildContext`, `mergeProps`, `mergeRefs`, and mobile web helpers such as `isIOS` and `getKeyboardHeight`

The full list with a one-line description each is on the [reference page](https://react-simplikit.slash.page/reference.html).

## AI Integration

Help your AI coding assistant find existing hooks, components and utilities, and check import and SSR rules with the included agent skill.

```bash
npx skills add toss/react-simplikit --skill react-simplikit
```

See the [AI Integration guide](https://react-simplikit.slash.page/ai-integration.html) for setup details. Agents can also use [llms.txt](https://react-simplikit.slash.page/llms.txt) to find API documentation.

## Documentation

Visit [react-simplikit.slash.page](https://react-simplikit.slash.page) for full documentation.

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/toss/react-simplikit/blob/main/.github/CONTRIBUTING.md).

## License

MIT © Viva Republica, Inc. See [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE) for details.
