---
'react-simplikit': patch
---

fix(useThrottledCallback): invoke the callback when the first value is `false`

The hook skips redundant invocations by comparing the incoming value against the last one it forwarded, but that comparison was seeded with `false`. Because the hook takes no initial value from the caller, a first call of `false` looked redundant and was dropped — so consumers whose state starts as `true` lost the transition back to `false`. The comparison now starts from a sentinel, so the first call is always forwarded regardless of its value.
