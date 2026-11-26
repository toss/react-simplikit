---
'react-simplikit': major
---

`subscribeKeyboardHeight` now defaults `immediate` to `true`, matching `useKeyboardHeight`. The callback runs once with the current keyboard height right after subscribing. Pass `immediate: false` to keep the previous behavior. `useKeyboardHeight` and `useAvoidKeyboard` are unaffected.

```ts
// before: the callback waits for the first resize or scroll event
subscribeKeyboardHeight({ callback });

// after: the callback also runs once right after subscribing
subscribeKeyboardHeight({ callback });

// to keep the previous behavior
subscribeKeyboardHeight({ callback, immediate: false });
```
