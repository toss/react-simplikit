# Separated

`Separated` is a component that allows you to insert a repeating component between each child element.
It is useful when you need to add dividers, spacers, or any other separator between list items.

## Props

- `with`: The component to insert between each element.
- `children`: The child elements to render.Each child will be filtered using `React.isValidElement` function.

## Example

```tsx
<Separated with={<Border type="padding24" />}>
  {LIST.map(item => (
    <div>{item.title}</div>
  ))}
</Separated>
```
