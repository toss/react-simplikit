---
'react-simplikit': patch
---

The JSDoc of every public export now declares its generic parameters with `@template`, and the `@returns` members of `useNetworkStatus` and `usePageVisibility` carry their types, so editors that read the published `.d.ts` comments see the same signatures the documentation shows. The English API pages were regenerated from JSDoc after fixing the generator: return descriptions keep their first word, optional parameters are marked with `?`, each `@example` renders in its own code block, nested return items are read per line, and angle brackets in descriptions no longer disappear on the page.
