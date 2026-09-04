---
'react-simplikit': minor
---

Add `useDebouncedValue` and `useThrottledValue`. Both take a value the caller owns and return a delayed copy of it: `useDebouncedValue(value, wait, { leading?, trailing? })` follows the value `wait` milliseconds after the last change, and `useThrottledValue(value, wait, { leading?, trailing? })` follows it at most once per `wait` milliseconds. They pair with the existing `useDebouncedCallback` and `useThrottledCallback`, which wrap a setter instead of a value.
