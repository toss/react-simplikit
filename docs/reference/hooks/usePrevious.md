# usePrevious

Returns the previous value of the input state. The previous value is recalculated on each re-render, and it updates only when the state value changes. The default comparison for determining state value changes is performed using the `prev === next` check.

## Signature

```typescript
function usePrevious<T>(state: T, compare?: (prev: T, next: T) => boolean): T;
```

### Parameters

- `state` (`T`): The state to get previous value.
- `compare` (`(prev: T, next: T) => boolean`, optional): The comparison function to detect that state has been changed. If not given, detect change by `prev === next` check.

### Returns

Previous value of the state.

## Examples

### Basic Usage

```typescript
const [count, setCount] = useState(0);

// initial value of previousCount is `0`
const previousCount = usePrevious(count);

// ...

setCount(prev => prev + 1); // count: 1, previous: 0

setUnrelated(prev => prev + 1); // previous: 0

setCount(prev => prev + 1); // count: 2, previous: 1
```

### Use custom compare function

```typescript
const compareObject = (prev: Record<string, unknown> | undefined, next: Record<string, unknown>) => {
  if (prev === undefined) {
    return false;
  }

  return Object.entries(prev).every(([key, value]) => next[key] === value);
};

const [data, setData] = useState({ hello: 'world' });
const [unrelated, setUnrelated] = useState(0);

// initial value of previousData is `{ hello: 'world' }`
const previousData = usePrevious(data, customCompare);

// ...

setUnrelated(prev => prev + 1); // previous: { hello: 'world' }

setData({ hello: 'world!' }); // data: { hello: 'world!' }, previous: { hello: 'world' }
```
