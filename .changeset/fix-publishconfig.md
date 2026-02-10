---
'react-simplikit': patch
'@react-simplikit/mobile': patch
---

Fix broken package exports by moving main/types/module/exports from publishConfig to top-level package.json fields

npm does not support publishConfig field overrides for manifest fields like main, types, and exports. The previous versions (react-simplikit@0.0.47, @react-simplikit/mobile@0.0.1) were published with incorrect entry points because publishConfig overrides were not applied during `npm publish`.
