# SwitchCase

`SwitchCase` is a component that allows you to use switch-case statements declaratively.

## Props

- `caseBy`: An object that defines the components to render based on the case.
- `value`: The case value
- `defaultComponent`: The component to render if the case does not match.

## Example

```jsx
<SwitchCase
  value={status}
  // component is rendered based on the status value
  caseBy={{
    a: () => <TypeA />,
    b: () => <TypeB />,
    c: () => <TypeC />,
  }}
  // component is rendered when the status value is not matched
  defaultComponent={() => <Default />}
/>
```
