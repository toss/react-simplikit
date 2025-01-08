# Separated

`Separated` is a component that can be used when you want to insert a component that repeats between each element.

## Props

- `with`: The component to insert between each element.
- `children`: The child elements to render. Valid elements are filtered using the validElement function.

## Example

```tsx
<Separated with={<Border type="padding24" />}>
  {LIST.map(item => (
    <div>item.title</div>
  ))}
</Separated>
```
