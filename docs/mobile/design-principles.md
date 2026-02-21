# Design Principles

`@react-simplikit/mobile` follows the core principles of `react-simplikit`, extended for mobile-specific challenges.

## Core Principles

### Respect React's Lifecycle Without Interference

`@react-simplikit/mobile` does not include implementations that directly interfere with React's lifecycle.
For example, it doesn't provide hooks like `useMount` or `useLifecycles`, instead favoring approaches that respect and utilize React's default behaviors.

### Lightweight and Fast Through Zero Dependencies

`@react-simplikit/mobile` has absolutely no dependencies. By not relying on additional libraries, it minimizes bundle size when integrated into projects and eliminates concerns about performance degradation.

### Ensures Reliability Through 100% Test Coverage

`@react-simplikit/mobile` thoroughly tests every function and branch.
We write comprehensive tests that include not only basic functionality but also SSR environment considerations for each implementation, preventing issues caused by unexpected behavior.

### Comprehensive Documentation for Easy Understanding and Use

`@react-simplikit/mobile` provides detailed documentation to help users quickly understand and utilize each feature. The documentation includes:

- **JSDoc Comments**: Detailed explanations of each function's behavior, parameters, and return values.
- **Usage Guides**: Clear and easy-to-follow instructions to get started immediately.
- **Practical Examples**: Examples demonstrating how to utilize implementations in real-world scenarios.

### Type Safe with Full TypeScript Support

`@react-simplikit/mobile` is built with TypeScript from the ground up. Every hook and utility comes with:

- **Strict Type Definitions**: All parameters, return values, and options are fully typed
- **IntelliSense Support**: Get autocompletion and inline documentation in your IDE
- **Generic Types**: Flexible APIs that preserve your type information
- **No `any` Types**: We avoid escape hatches that compromise type safety

## API Design Standards

### Hook Return Values

We follow consistent patterns for hook return values:

- **Object**: For state and related values (e.g., `useKeyboardHeight(): { keyboardHeight }`, `useVisualViewport(): { viewport }`)
- **void**: For side-effect only hooks (e.g., `useBodyScrollLock(): void`)

### Parameters

- Required parameters come first, optional parameters last
- Use an options object for 3+ optional parameters

### SSR Safety Pattern

All hooks follow the SSR-safe pattern:

```typescript
// ✅ SSR-safe - All hooks follow this pattern
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;
```

## Mobile-Specific Principles

### Platform-Aware Design

We consider the behavioral differences between iOS and Android in our implementations:

- **Visual Viewport API differences**:
  - iOS: `offsetTop` becomes negative when the keyboard appears
  - Android: `offsetTop` typically remains 0
- **Keyboard height calculation**: Platform-specific handling for accurate measurements

### SSR Safety First

Every hook includes SSR testing to ensure safe server-side rendering:

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

### Performance Optimization

Mobile environments require special attention to performance:

- **Event throttling/debouncing**: Optimize frequent events like scroll and resize
- **Passive event listeners**: Use passive listeners where applicable
- **React transitions**: Leverage `startTransition` for non-urgent updates
