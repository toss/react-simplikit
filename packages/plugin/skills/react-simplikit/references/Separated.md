# Separated

`Separated` is a component that inserts a specified component between each child element. It is useful for adding separators, spacing, or other repeating elements in lists.

## Interface

```ts
function Separated(children: React.ReactNode, by: React.ReactNode): JSX.Element;
```

### Parameters

<Interface
  required
  name="children"
  type="React.ReactNode"
  description="The child elements to render. Only valid React elements (<code>React.isValidElement</code>) will be rendered."
/>

<Interface
  required
  name="by"
  type="React.ReactNode"
  description="The component to insert between child elements."
/>

### Return Value

<Interface
  name=""
  type="JSX.Element"
  description="React component that separates children with a specified separator."
/>

## Example

```tsx
function App() {
  return (
    <Separated by={<Border type="padding24" />}>
      {['hello', 'react', 'world'].map(item => (
        <div key={item}>{item}</div>
      ))}
    </Separated>
  );
  // Expected output:
  // <div>hello</div>
  // <Border type="padding24" />
  // <div>react</div>
  // <Border type="padding24" />
  // <div>world</div>
}
```
