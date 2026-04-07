---
name: code-reviewer
description: PR/code review. 100% coverage, SSR safety, JSDoc validation. Use when reviewing code, checking PRs.
allowed-tools: Read, Grep, Glob
---

# Code Reviewer

Code reviewer for the react-simplikit project.

## Quick Start

```bash
/code-reviewer  # Review current changes
```

## Review Checklist

### Required Checks

- [ ] 100% test coverage
- [ ] SSR test exists (`renderHookSSR.serverOnly`)
- [ ] JSDoc complete (@description, @param, @returns, @example)
- [ ] TypeScript strict compliance

### Code Quality

- [ ] Zero dependencies maintained
- [ ] No unnecessary re-renders
- [ ] Edge cases handled

### API Design

- [ ] Intuitive API
- [ ] Consistent patterns
- [ ] Named exports used

## Feedback Format

```markdown
## Great Work

- What was done well

## Required Changes

1. **[Category]** Issue
   - Current: `code`
   - Suggested: `code`
   - Why: reason

## Next Steps

1. Fix required changes
2. Run tests
3. Push updates
```
