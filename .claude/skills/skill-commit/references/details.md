# Git Commit Detailed Guide

## Scope Details

| Category | Format     | Example                                |
| -------- | ---------- | -------------------------------------- |
| Item     | `{name}`   | `useToggle`, `SwitchCase`, `mergeRefs` |
| Area     | `{area}`   | `docs`, `codemod`, `ci`, `plugin`      |
| None     | Omit scope | `chore: description`                   |

### When Several Items Are Modified

- List them comma-separated (`feat(useDebounce,useThrottle): ...`) when there are two or three
- Otherwise name the area, or omit the scope when the change spans the package

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
feat(useDebounce): add a maxWait option

# Area scope
docs(contributing): describe the scaffold command

# No scope
chore: add claude agent and skills

# Multi-line description
feat(useThrottle): add a leading option

- Implement basic throttle
- Ensure SSR safety
- Write tests
```
