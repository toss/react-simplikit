# Git Commit Detailed Guide

## Scope Details

| Category | Format     | Example              |
| -------- | ---------- | -------------------- |
| Package  | `{name}`   | `core`, `mobile`     |
| None     | Omit scope | `chore: description` |

### When Multiple Packages Are Modified

Group under an appropriate higher-level concept:

- Or specify only the primary target of the change

## Description Writing Rules

- Write in English
- Keep it concise
- No period at the end
- Common expressions: `add ~`, `fix ~`, `remove ~`, `update ~`, `improve ~`, `apply ~`

## Cautions

- Never commit sensitive files such as `.env`, `credentials.json`
- Do not commit if there are no changes
- Push only when explicitly requested
- If a pre-commit hook fails, fix the issue and create a new commit (never use amend)
- Write in the format `type(scope):` with no space before the colon

## Full Examples

```bash
# Basic
feat(core): add useDebounce hook

# Package scope
feat(mobile): add useKeyboardHeight hook

# No scope
chore: add claude agent and skills

# Multi-line description
feat(core): add useThrottle hook

- Implement basic throttle
- Ensure SSR safety
- Write tests
```
