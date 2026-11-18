---
'react-simplikit': patch
---

`SwitchCase` now only matches keys defined on `caseBy` itself. Before, a value such as `'toString'` or `'constructor'` matched a method inherited from `Object.prototype`, so the component rendered `[object Undefined]` or threw instead of rendering `defaultComponent`.
