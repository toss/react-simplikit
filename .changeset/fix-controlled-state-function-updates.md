---
'react-simplikit': patch
---

`useControlledState` now applies multiple function updates in the same tick in order when uncontrolled, instead of computing each from the value captured at render. As a consequence, in uncontrolled mode `onChange` is called once after the state commits with the final value, not synchronously on every `setValue` call. Controlled mode is unchanged: it still computes from the current `value` prop, so two function updates in the same tick see the same previous value.
