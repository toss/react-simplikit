# usePrevious

Returns the previous value of the input state. The previous value is recalculated on each re-render, and by default, it updates only when the state value changes. The default comparison for determining state value changes is performed using the `prev === next` check.

## Signature

```typescript
function usePrevious<T>(
  state: T,
  options: PreviousOptions<T> = {
    compare: (prev: T | undefined, next: T) => boolean,
    withoutCompare: false,
    withInitialValue: false,
  }
): T | undefined;
```

### Parameters

- `state` (`T`): The state to get previous value.
- `options` (`PreviousOptions<T>`, optional): The options object.
  - `compare` (`(prev: T | undefined, next: T) => boolean`, optional): The comparison function to detect that state has been changed. If not given, detect change by `prev === next` check.
  - `withoutCompare` (`boolean`, optional): Set `withoutCompare` to `true` when previous value always need to be updated. Default value is `false`.
  - `withInitialValue` (`boolean`, optional): Set `withInitialValue` to `true` when initial value of previous should be initial value of state. Default value is `false`.

### Returns

Previous value of the state.

## Examples

### Basic Usage

```typescript
const [count, setCount] = useState(0);

// initial value of previousCount is `undefined`
const previousCount = usePrevious(count);

// ...

setUnrelated(prev => prev + 1); // previous: undefined

setCount(prev => prev + 1); // count: 1, previous: 0
```

### Return initial value on first mount

```typescript
const [count, setCount] = useState(0);

// initial value of previousCount is `0`
const previousCount = usePrevious(count, { withInitialValue: true });

// ...

setCount(prev => prev + 1); // count: 1, previous: 0
```

### Update value when re-render occured

```typescript
const [count, setCount] = useState(0);
const [unrelated, setUnrelated] = useState(0);

// initial value of previousCount is `undefined`
const previousCount = usePrevious(count, { withoutCompare: true });

// ...

setUnrelated(prev => prev + 1); // previous: 0

setCount(prev => prev + 1); // count: 1, previous: 0
```

### Use custom compare function

```typescript
const compareObject = (prev: Record<string, unknown> | undefined, next: Record<string, unknown>) => {
  if (prev === undefined) {
    return false;
  }

  return Object.entries(prev).every(([key, value]) => next[key] === value);
};

const [count, setCount] = useState({ hello: 'world' });
const [unrelated, setUnrelated] = useState(0);

// initial value of previousCount is `undefined`
const previousCount = usePrevious(count, { compare: customCompare });

// ...

setUnrelated(prev => prev + 1); // previous: undefined

setCount({ hello: 'world!' }); // count: { hello: 'world!' }, previous: { hello: 'world' }
```
