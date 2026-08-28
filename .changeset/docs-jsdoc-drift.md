---
'react-simplikit': patch
---

JSDoc corrections that show up in editor hover. `useIntersectionObserver`'s `options.root` is typed `Element | Document | null` instead of `boolean`. `useList` and `useSet` now declare their generic parameter, their optional initial state and every member they return. `mergeProps` and `mergeRefs` mark their rest parameter as one, so the documented signature matches the implementation.
