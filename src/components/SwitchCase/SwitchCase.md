# SwitchCase

`SwitchCase` is a component that allows you to declaratively render components based on a given value, similar to a `switch-case` statement.  
It is useful when you need to conditionally render different components based on a specific state.

## Props

- `caseBy`: An object that maps values to components to render.  
  The keys represent possible values, and the values are functions returning the corresponding components.
- `value`: The value to compare against.  
  The component associated with the matching key in `caseBy` will be rendered.
- `defaultComponent`: The component to render when `value` does not match any key in `caseBy`.

## Example

```jsx
<SwitchCase
  value={status}
  // Renders TypeA, TypeB, or TypeC based on the status value.
  caseBy={{
    a: () => <TypeA />,
    b: () => <TypeB />,
    c: () => <TypeC />,
  }}
  // Renders Default when the status value does not match any case.
  defaultComponent={() => <Default />}
/>
```
