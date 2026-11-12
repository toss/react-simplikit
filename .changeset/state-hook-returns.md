---
'react-simplikit': major
---

`useBooleanState`, `useStorageState` and `useCounter` now return `[value, actions]`, matching `useList`, `useMap` and `useSet`. The actions object keeps the same reference across renders.

```ts
// before
const [isOpen, setTrue, setFalse, toggle] = useBooleanState(false);
const [token, setToken, refreshToken] = useStorageState<string>('token');
const { count, increment, decrement, reset, setCount } = useCounter(0);

// after
const [isOpen, { setTrue, setFalse, toggle }] = useBooleanState(false);
const [token, { setValue, refresh }] = useStorageState<string>('token');
const [count, { increment, decrement, reset, setCount }] = useCounter(0);
```

`useToggle` keeps its `[value, toggle]` signature and now declares its return type, so React 18 consumers no longer see the React 19 `ActionDispatch` type.
