---
'react-simplikit': minor
---

Add `useCallbackOnce`, which runs a callback only once until its `deps` change and has the same signature and behavior as `useCallbackOncePerRender`. `useCallbackOncePerRender` is now deprecated in favor of `useCallbackOnce` and still works as an alias of it. The second example now lists `userId` in the effect's dependencies, because the returned function keeps the same reference and an effect keyed only on it does not run again when `deps` change.
