# Contributing to @react-simplikit/mobile

This guide extends the [core contributing guide](/core/contributing).

## Development Workflow

```
Scaffold → Implementation → Testing → Documentation → Review → Changeset → Merge
```

### 1. Scaffold

Create the basic structure for a new hook:

```bash
yarn scaffold useNewHook --type h   # Hook
```

### 2. Implementation

Follow the [Design Principles](/mobile/design-principles):

- Named exports only
- Maximize TypeScript inference
- Apply the SSR safety pattern

```typescript
// ✅ SSR-safe pattern
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;
```

### 3. Documentation

All exported functions must include JSDoc with 4 required tags:

```typescript
/**
 * @description One-line summary. (required)
 * @param {Type} name - Description. (required if has params)
 * @returns {Type} Description. (required if has return)
 * @example
 * const result = useHook(input); // (required)
 */
```

::: tip
**Do I need to write documentation?**

No, you don't need to write documentation separately. Instead, please write detailed JSDoc comments. Once your PR is merged, English and Korean documentation will be automatically generated based on the JSDoc, and a PR for adding the documentation will be automatically created.
:::

### 4. Testing

100% coverage is required:

```bash
yarn test:spec      # Run single test
yarn test:coverage  # Check coverage
```

#### SSR Testing (Required)

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

#### Coverage Checklist

- [ ] All if/else branches
- [ ] All switch cases
- [ ] All early returns
- [ ] Cleanup functions (useEffect return)

### 5. Creating a Changeset

When your code changes affect the package, you need to create a changeset:

```bash
yarn changeset
```

Select the type of change:

- `patch`: Bug fixes or minor changes
- `minor`: New features (maintaining backward compatibility)
- `major`: Breaking changes (breaking backward compatibility)

::: tip
Both packages are currently in the `0.0.x` stage. During this phase, most changes should use `patch`.
If you're unsure about the version type, please discuss with the maintainers.
:::

## Mobile-Specific Guidelines

### Testing on Real Devices

- Testing on iOS Safari and Android Chrome is recommended
- Visual Viewport API behavior should be verified on real devices

### Platform Differences

Consider these platform differences when implementing:

| Feature                    | iOS                                    | Android             |
| -------------------------- | -------------------------------------- | ------------------- |
| `visualViewport.offsetTop` | Becomes negative when keyboard appears | Typically remains 0 |
| Keyboard behavior          | Viewport is pushed up                  | Resizes the layout  |

### window/document Access Pattern

Always use the SSR-safe pattern when accessing browser APIs:

```typescript
// ✅ SSR-safe pattern
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;

// Now safe to use window/document
window.visualViewport?.addEventListener('resize', handler);
```

## Documentation Contribution

There are no specific conditions for contributing to documentation. If you find incorrect information, poor translations, or have additional content to add, feel free to make edits. Please write documentation clearly and concisely from the reader's perspective.
