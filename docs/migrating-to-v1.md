---
description: Upgrade from react-simplikit v0 to v1
---

# Migrating to v1

v1 makes the hook interfaces predictable: time options carry their unit, callbacks and delays go in one options object, and state hooks return `[value, actions]`. Most of these changes are mechanical, so a codemod rewrites them for you.

## 1. Run the codemod

Commit or stash first, then run it from your project root:

```sh
npx @react-simplikit/codemod v0-to-v1
```

Add `--dry-run` to see the changes without writing files. The codemod only touches calls imported from `react-simplikit`, and running it twice changes nothing.

Code it cannot rewrite safely, such as options passed as a variable, is left as is and listed under `manual-review` with its file and line. Fix those by hand, then upgrade:

```sh
npm install react-simplikit@^1
```

## 2. What the codemod rewrites

| Change                                                         | v0                                                                      | v1                                                                          |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `useBooleanState` returns `[value, actions]`                   | `const [open, setTrue, setFalse, toggle] = useBooleanState()`           | `const [open, { setTrue, setFalse, toggle }] = useBooleanState()`           |
| `useStorageState` returns `[value, actions]`                   | `const [token, setToken, refresh] = useStorageState('token')`           | `const [token, { setValue: setToken, refresh }] = useStorageState('token')` |
| `useCounter` returns `[value, actions]`                        | `const { count, increment } = useCounter(0)`                            | `const [count, { increment }] = useCounter(0)`                              |
| `useInterval` takes one options object                         | `useInterval(poll, 1000)`                                               | `useInterval({ onTick: poll, delayMs: 1000 })`                              |
| `useTimeout` takes one options object                          | `useTimeout(close, 3000)`                                               | `useTimeout({ onTimeout: close, delayMs: 3000 })`                           |
| Time options end in `Ms`                                       | `useDebouncedCallback({ timeThreshold: 300 })`                          | `useDebouncedCallback({ debounceMs: 300 })`                                 |
|                                                                | `useThrottledCallback({ timeThreshold: 300 })`                          | `useThrottledCallback({ throttleMs: 300 })`                                 |
|                                                                | `useImpressionRef({ timeThreshold })`, `<ImpressionArea timeThreshold>` | `useImpressionRef({ timeThresholdMs })`, `<ImpressionArea timeThresholdMs>` |
|                                                                | `useLongPress(fn, { delay })`                                           | `useLongPress(fn, { delayMs })`                                             |
|                                                                | `useAvoidKeyboard({ transitionDuration })`                              | `useAvoidKeyboard({ transitionDurationMs })`                                |
| `edges` becomes `leading` and `trailing` in the throttle hooks | `useThrottle(fn, 100, { edges: ['leading'] })`                          | `useThrottle(fn, 100, { leading: true, trailing: false })`                  |
| `useDoubleClick` options are renamed                           | `useDoubleClick({ click, doubleClick, delay })`                         | `useDoubleClick({ onClick, onDoubleClick, delayMs })`                       |

## 3. What to check by hand

These changes keep the same code but behave differently, so no codemod can make them for you.

### Browser hooks start from a fixed value

`useScrollDirection`, `useVisualViewport`, `useNetworkStatus`, `usePageVisibility` and `useSafeAreaInset` return the same value on the first client render as on the server, and the browser value arrives after mount. This fixes a hydration mismatch, but code that read the browser value on the first render now sees the value below.

| Hook                 | First render                                      |
| -------------------- | ------------------------------------------------- |
| `useScrollDirection` | `position: 0`                                     |
| `useVisualViewport`  | `viewport: null`                                  |
| `useNetworkStatus`   | `{}`                                              |
| `usePageVisibility`  | `{ isVisible: true, visibilityState: 'visible' }` |
| `useSafeAreaInset`   | `{ top: 0, bottom: 0, left: 0, right: 0 }`        |

### `useStorageState` checks JSON values

Without `serializer` and `deserializer`, setting a value that JSON cannot hold, such as a `Date`, `Map`, function or `NaN`, now throws with its path instead of storing a changed value. Store those with both `serializer` and `deserializer`. `refresh` now only reads storage again and no longer writes to it.

### `subscribeKeyboardHeight` calls back immediately

The callback now runs once right after subscribing. Pass `immediate: false` to keep the v0 behavior.

## Deprecated names

These still work in v1 and only show a deprecation notice in your editor. Rename them when convenient.

| Deprecated                 | Use instead               |
| -------------------------- | ------------------------- |
| `useCallbackOncePerRender` | `useCallbackOnce`         |
| `useVisibilityEvent`       | `usePageVisibilityEffect` |

The full list of changes is in the [v1.0.0 roadmap](https://github.com/toss/react-simplikit/issues/533) and the [changelog](https://github.com/toss/react-simplikit/blob/main/packages/react-simplikit/CHANGELOG.md).
