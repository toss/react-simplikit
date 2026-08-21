---
'react-simplikit': minor
---

feat(useAsyncEffect): provide an AbortSignal to the effect and abort it on cleanup

`useAsyncEffect` now creates an `AbortController` for each effect run and passes its `signal` to the effect callback. The signal is aborted when the component unmounts or dependencies change, so in-flight async operations (such as `fetch`) can be cancelled without manual boilerplate. An optional third `reason` argument is forwarded to `AbortController.abort(reason)`.
