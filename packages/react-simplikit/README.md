# react-simplikit

[![npm version](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

English | [한국어](./README-ko_kr.md) | [日本語](./README-ja_jp.md)

A lightweight, zero-dependency React utilities library providing hooks, components, and utilities.

## Features

- **Zero dependencies** - Extremely lightweight
- **100% TypeScript** - Full type safety
- **100% Test coverage** - Reliable and stable
- **SSR-safe** - Works with Next.js and other SSR frameworks
- **Tree-shakeable** - Only bundle what you use

## Library Direction

**react-simplikit is now maintained as a Universal Hook Library providing only pure state/logic hooks.**

We are repositioning react-simplikit to focus exclusively on **platform-independent hooks** that work seamlessly across web and mobile (React Native, etc.).

### What's Maintained: Pure State/Logic Hooks

Hooks that don't depend on specific platform APIs will continue to be actively maintained:

- State management hooks like `useToggle`, `useBooleanState`, `useCounter`
- Lifecycle hooks like `usePrevious`
- Utility hooks like `useDebounce`, `useThrottle`
- **Backward compatibility (BC) is preserved** for these existing pure logic hooks

### What's Deprecated: Browser/Platform-Dependent Hooks

The following hooks that strongly depend on browser-specific APIs are now deprecated:

- `useGeolocation` - depends on `navigator.geolocation`
- `useStorageState` - depends on `localStorage`/`sessionStorage`
- `useIntersectionObserver` - depends on `IntersectionObserver` API
- `useImpressionRef` - depends on `IntersectionObserver` + Visibility API
- `useDoubleClick`, `useLongPress` - depend on DOM events + `window.setTimeout`
- `useOutsideClickEffect` - depends on DOM events + `document`
- `useVisibilityEvent` - depends on `document.visibilityState`

These hooks:

- Will not receive new features or major enhancements
- Are marked as `@deprecated` in documentation
- May be removed in future major versions

### Package Status

- react-simplikit will **not be archived**
- Pure state/logic hooks will continue to be maintained
- Critical bug fixes and minimal maintenance will continue
- No new browser/platform-dependent hooks will be added

## Installation

```bash
npm install react-simplikit
# or
yarn add react-simplikit
# or
pnpm add react-simplikit
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

## What's Included

### Hooks

| Hook                      | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `useBooleanState`         | Manage boolean state with handlers                    |
| `useDebounce`             | Debounce a callback function                          |
| `useDebouncedCallback`    | Debounce an `onChange` callback via an options object |
| `useInterval`             | Set up intervals declaratively                        |
| `useIntersectionObserver` | Observe element visibility                            |
| `usePreservedCallback`    | Stable callback reference                             |
| `usePreservedReference`   | Stable object reference                               |
| ...                       | [See all hooks](https://react-simplikit.slash.page)   |

### Components

| Component        | Description                       |
| ---------------- | --------------------------------- |
| `SwitchCase`     | Declarative switch-case rendering |
| `Separated`      | Render items with separators      |
| `ImpressionArea` | Track element impressions         |

### Utilities

| Utility        | Description                                         |
| -------------- | --------------------------------------------------- |
| `buildContext` | Define React Context with less boilerplate          |
| `mergeProps`   | Merge props, composing `className`, `style`, events |
| `mergeRefs`    | Combine multiple refs into a single ref             |

## Documentation

Visit [react-simplikit.slash.page](https://react-simplikit.slash.page) for full documentation.

## Related Packages

- [Mobile web utilities](https://react-simplikit.slash.page/mobile/intro.html) - included in `react-simplikit`

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/toss/react-simplikit/blob/main/CONTRIBUTING.md).

## License

MIT © Viva Republica, Inc. See [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE) for details.
