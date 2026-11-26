---
'react-simplikit-codemod': patch
---

The default ignore globs (`node_modules`, `dist`, `build`, `out`, …) are now matched relative to the project root. Before, they were matched against the absolute path, so a project that lived under a directory with one of those names, such as `~/build/my-app`, had every file skipped and the codemod changed nothing.
