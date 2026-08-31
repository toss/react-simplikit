---
'react-simplikit': patch
---

Re-export the `SafeAreaInset` type from the package root. `@react-simplikit/mobile` exported it, but it was dropped when that package was absorbed into the root entry, leaving `import type { SafeAreaInset }` with no replacement.
