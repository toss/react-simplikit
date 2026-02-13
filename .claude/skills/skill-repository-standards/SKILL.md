---
name: repository-standards
description: Essential documents such as README, CONTRIBUTING, LICENSE, CODE_OF_CONDUCT, SECURITY. Use when setting up repository docs.
allowed-tools: Read, Write, Edit, Glob
---

# Open Source Repository Standards

## Required Files

- [ ] README.md
- [ ] LICENSE (MIT)
- [ ] CONTRIBUTING.md
- [ ] CODE_OF_CONDUCT.md
- [ ] SECURITY.md
- [ ] .github/ISSUE_TEMPLATE/
- [ ] .github/PULL_REQUEST_TEMPLATE.md

## README.md Structure

```markdown
# react-simplikit

> A lightweight, zero-dependency React utilities library

## Features

- ✅ Zero dependencies
- ✅ 100% TypeScript
- ✅ SSR-safe

## Installation

npm install react-simplikit

## Quick Start

import { useDebounce } from 'react-simplikit';

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT
```

## PR Template

```markdown
## Description

## Checklist

- [ ] Tests pass
- [ ] 100% coverage
- [ ] JSDoc complete
- [ ] Changeset included
```

## References

- [details.md](references/details.md) - Full templates
