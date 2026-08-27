# mergeRefs

This function takes multiple refs (RefObject or RefCallback) and returns a single ref that updates all provided refs. It's useful when you need to pass multiple refs to a single element.

## Interface

```ts
function mergeRefs<T>(
  ...refs: Array<RefObject<T> | RefCallback<T> | null | undefined>
): RefCallback<T>;
```

### Parameters

<Interface
  required
  name="refs"
  type="Array<RefObject<T> | RefCallback<T> | null | undefined>"
  description="An array of refs to be merged. Each ref can be either a RefObject or RefCallback."
/>

### Return Value

<Interface
  name=""
  type="RefCallback<T>"
  description="single ref callback that updates all provided refs."
/>

## Example

```tsx
forwardRef(function Component(props, parentRef) {
  const myRef = useRef(null);

  return <div ref={mergeRefs(myRef, parentRef)} />;
});
```
