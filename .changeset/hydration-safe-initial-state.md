---
'react-simplikit': major
---

`useScrollDirection`, `useVisualViewport`, `useNetworkStatus`, `usePageVisibility` and `useSafeAreaInset` no longer initialize state from browser APIs. The first client render now returns the same value as the server, and the browser value arrives after mount. Before, rendering the value caused a hydration mismatch.

The first render changes in client-only apps too:

| Hook                 | First render                                      |
| -------------------- | ------------------------------------------------- |
| `useScrollDirection` | `position: 0`                                     |
| `useVisualViewport`  | `viewport: null`                                  |
| `useNetworkStatus`   | `{}`                                              |
| `usePageVisibility`  | `{ isVisible: true, visibilityState: 'visible' }` |
| `useSafeAreaInset`   | `{ top: 0, bottom: 0, left: 0, right: 0 }`        |
