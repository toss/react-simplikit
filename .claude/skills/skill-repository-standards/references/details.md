# Repository Standards Detailed Guide

## LICENSE (MIT)

```
MIT License
Copyright (c) 2025 Viva Republica, Inc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## CONTRIBUTING.md

```markdown
# Contributing

Thank you for your interest in contributing!

## Setup

git clone https://github.com/user/react-simplikit
cd react-simplikit
npm install
npm run build
npm test

## PR Requirements

- [ ] Tests pass
- [ ] 100% coverage maintained
- [ ] JSDoc complete
- [ ] Changeset included (if applicable)

## Development

1. Create a branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Run tests: `npm test`
4. Create changeset: `npm run changeset`
5. Submit PR
```

## Issue Templates

`.github/ISSUE_TEMPLATE/bug_report.yml`:

```yaml
name: Bug Report
description: Report a bug
labels: ['bug']
body:
  - type: textarea
    id: description
    attributes:
      label: Describe the bug
      description: A clear description of what the bug is.
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to reproduce
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
    validations:
      required: true
```

## SECURITY.md

```markdown
# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities to security@example.com.

Do not report security vulnerabilities through public GitHub issues.
```

## CODE_OF_CONDUCT.md

Using the Contributor Covenant Code of Conduct is recommended.
https://www.contributor-covenant.org/
