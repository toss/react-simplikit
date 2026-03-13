# Test Writing Detailed Guide

## Advanced Test Patterns

### act() Usage

```typescript
import { act } from '@testing-library/react';

it('handles async state updates', async () => {
  const { result } = renderHook(() => useAsyncHook());

  await act(async () => {
    await result.current.fetchData();
  });

  expect(result.current.data).toBeDefined();
});
```

### waitFor Pattern

```typescript
import { waitFor } from '@testing-library/react';

it('waits for condition', async () => {
  const { result } = renderHook(() => useDebounce(value, 300));

  await waitFor(() => {
    expect(result.current).toBe(expected);
  });
});
```

### Timer Mocking

```typescript
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('debounces correctly', () => {
  const { result } = renderHook(() => useDebounce('test', 300));

  vi.advanceTimersByTime(300);

  expect(result.current).toBe('test');
});
```

## SSR Test Details

### renderHookSSR Usage

```typescript
import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

describe('SSR Safety', () => {
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useHook());
    expect(result.current).toBeDefined();
  });

  it('hydrates correctly', () => {
    const { result } = renderHookSSR(() => useHook());
    expect(result.current).toBe(expected);
  });
});
```

### window/document Access

```typescript
// ✅ SSR-safe pattern
const isClient = typeof window !== 'undefined';

// Verify in tests
it('handles server environment', () => {
  // renderHookSSR.serverOnly simulates an environment without window
  const result = renderHookSSR.serverOnly(() =>
    useMediaQuery('(min-width: 768px)')
  );
  expect(result.current).toBe(false); // Returns default value on server
});
```

## Coverage Checklist

- [ ] All if/else branches
- [ ] All switch cases
- [ ] All early returns
- [ ] All error cases
- [ ] All callback functions
- [ ] Cleanup functions (useEffect return)
