---
'@react-simplikit/mobile': minor
---

Export `useKeyboardHeight` from the package entry. The hook was documented but not importable: its folder was named `keyboardHeight`, breaking the folder-name convention, and the re-export was missing from `src/index.ts`. The folder is renamed to `useKeyboardHeight` and the hook is now part of the public API.
