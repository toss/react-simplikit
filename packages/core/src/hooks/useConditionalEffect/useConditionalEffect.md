# useConditionalEffect

`useConditionalEffect` is a React hook that conditionally executes effects based on a predicate function. This provides more control over when effects run beyond just dependency changes.

## Interface

```ts
function useConditionalEffect(
  effect: EffectCallback,
  deps: DependencyList,
  condition: (prevDeps: T | undefined, currentDeps: T) => boolean
): void;
```

### Parameters

<Interface
  required
  name="effect"
  type="EffectCallback"
  description="The effect callback to run."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="Dependencies array, similar to useEffect."
/>

<Interface
  required
  name="condition"
  type="(prevDeps: T | undefined, currentDeps: T) => boolean"
  description="Function that determines if the effect should run based on previous and current deps. - On the initial render, <code>prevDeps</code> will be <code>undefined</code>. Your <code>condition</code> function should handle this case. - If you want your effect to run on the initial render, return <code>true</code> when <code>prevDeps</code> is <code>undefined</code>. - If you don\'t want your effect to run on the initial render, return <code>false</code> when <code>prevDeps</code> is <code>undefined</code>."
/>

### Return Value

This hook does not return anything.

## Example

```tsx
import { useConditionalEffect } from 'react-simplikit';

function Component() {
  const [count, setCount] = useState(0);

  // Only run effect when count increases
  useConditionalEffect(
    () => {
      console.log(`Count increased to ${count}`);
    },
    [count],
    (prevDeps, currentDeps) => {
      // Only run when count is defined and has increased
      return prevDeps && currentDeps[0] > prevDeps[0];
    }
  );

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Increment: {count}
    </button>
  );
}
```
