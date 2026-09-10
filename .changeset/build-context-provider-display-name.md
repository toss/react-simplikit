---
'react-simplikit': patch
---

`buildContext` now sets `displayName` on the returned `Provider` to `` `${contextName}Provider` ``, so React DevTools shows which context a provider belongs to instead of a bare `Provider`. The documentation example also passed `null` as the default values, which the signature rejects; it now passes an object.
