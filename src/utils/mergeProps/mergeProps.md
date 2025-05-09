# mergeProps

`mergeProps` is a utility function that merges multiple props objects into a single object. It handles merging of `className`, `style`, and `function` properties.

## Interface

```ts
function mergeProps<PropsList>(
  ...props: PropsList
): TupleToIntersection<PropsList>;
```

### Parameters

<Interface
  required
  name="props"
  type="PropsList"
  description="The props objects to merge."
/>

### Return Value

<Interface
  name=""
  type="TupleToIntersection<PropsList>"
  description="merged props object."
/>

## Example

```tsx
const mergedProps = mergeProps(
  { className: 'foo', style: { color: 'red' } },
  { className: 'bar', style: { backgroundColor: 'blue' } }
);
console.log(mergedProps); // { className: 'foo bar', style: { color: 'red', backgroundColor: 'blue' } }
```
