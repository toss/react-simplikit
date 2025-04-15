# useIsomorphicLayoutEffect

During SSR, there is no DOM to synchronously measure or mutate, so React warns about using useLayoutEffect. This hook provides the behavior of useLayoutEffect in the browser without triggering SSR warnings. It runs synchronously after DOM updates but before paint, making it ideal for: - Measuring DOM elements after render - Applying DOM changes before paint - Preventing UI flashes or layout shifts - Supporting both client and server environments safely

## Interface
```ts
function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList,
): void;

```

### Parameters

<Interface
  required
  name="effect"
  type="React.EffectCallback"
  description="The effect function."
/>

<Interface
  name="deps"
  type="React.DependencyList"
  description="An optional array of dependencies."
/>

### Return Value

This hook does not return anything.

## Example

```tsx
useIsomorphicLayoutEffect(() => {
  // Code to be executed during the layout phase on the client side
}, [dep1, dep2, ...]);
```
  