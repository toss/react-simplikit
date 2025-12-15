![react-simplikit](./src/public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/slash/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

English | [Korean](./README-ko_kr.md)

`react-simplikit` is a lightweight yet powerful library that provides various utilities for use in React environments.

- `react-simplikit` is dependency-free, making it extremely lightweight.
- `react-simplikit` guarantees reliability with 100% test coverage.
- `react-simplikit` offers JSDoc comments, detailed documentation, and examples to ensure any developer can easily use it.

## Library Direction

**react-simplikit is now maintained as a Universal Hook Library providing only pure state/logic hooks.**

We are repositioning react-simplikit to focus exclusively on **platform-independent hooks** that work seamlessly across web and mobile (React Native, etc.).

### What's Maintained: Pure State/Logic Hooks

Hooks that don't depend on specific platform APIs will continue to be actively maintained:

- State management hooks like `useToggle`, `useBooleanState`, `useCounter`
- Lifecycle hooks like `usePrevious`, `useMount`
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

## Example

```tsx
import { useBooleanState } from 'react-simplikit';

function Component() {
  // using the `useBooleanState` hook to manage state.
  const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] =
    useBooleanState(false);

  return (
    <div>
      <p>Bottom Sheet State: {open ? 'Open' : 'Closed'}</p>
      <button onClick={openBottomSheet}>Open</button>
      <button onClick={closeBottomSheet}>Close</button>
      <button onClick={toggleBottomSheet}>Toggle</button>
    </div>
  );
}
```

## Contributing

Contributions are welcome from everyone in the community. Please check the contribution guide linked below.

[CONTRIBUTING](./src/docs/en/contributing.md)

## License

MIT © Viva Republica, Inc. For more details, see [LICENSE](./LICENSE)
