---
'react-simplikit': major
---

`useInterval` and `useTimeout` now take a single options object, with the callback as `onTick` and `onTimeout` and the delay as `delayMs`. `useInterval` no longer accepts a bare number as its delay.

```ts
// before
useInterval(poll, 1000);
useInterval(poll, { delay: 1000, immediate: true });
useTimeout(close, 3000);

// after
useInterval({ onTick: poll, delayMs: 1000 });
useInterval({ onTick: poll, delayMs: 1000, immediate: true });
useTimeout({ onTimeout: close, delayMs: 3000 });
```
