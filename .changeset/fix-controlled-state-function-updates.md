---
'react-simplikit': patch
---

`useControlledState` now applies multiple `setValue` calls in the same tick in order when uncontrolled, instead of computing each from the value captured at render. This affects both function updates and plain values: `setValue(prev => prev + 3)` twice now adds 6 instead of 3, and `setValue('b')` followed by `setValue('a')` from a current value of `'a'` now settles on `'a'` instead of `'b'`.

As a consequence, in uncontrolled mode `onChange` is called once after the state commits with the final value, rather than synchronously on every `setValue` call. A parent that mirrors `onChange` into its own state therefore renders once more per update, no call is made when the final value equals the previous one, and a change reported by a component that unmounts in the same commit is dropped. Under StrictMode a single change is now reported once instead of twice.

Controlled mode is unchanged: it still computes from the current `value` prop, so two function updates in the same tick see the same previous value.
