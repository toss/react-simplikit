# usePreservedReference

`usePreservedReference` is a React hook that preserves the reference of a value unless it changes based on a comparator function. By default, it uses deep equality checks with `JSON.stringify`.

## Interface

```ts
function usePreservedReference<T extends NotNullishValue>(value: T, areValuesEqual?: (a: T, b: T) => boolean): T;
```

### Parameters

- `value` (`T`): The value whose reference needs to be preserved.
- `areValuesEqual` (`(a: T, b: T) => boolean`): Optional comparator function to determine equality between two values. Defaults to a deep equality check using `JSON.stringify`.

### 반환 값

Returns the preserved value reference.

## Examples

```tsx
import { usePreservedReference } from '@tossteam/react';

function Component({ loggerParams }: { loggerParams: object }) {
  const preservedParams = usePreservedReference(loggerParams);

  useEffect(() => {
    console.log('Params changed:', preservedParams);
  }, [preservedParams]);

  return <div>Check the console for updates.</div>;
}
```
