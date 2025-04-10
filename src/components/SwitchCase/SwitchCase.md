# SwitchCase

`SwitchCase` is a component that allows you to declaratively render components based on a given value, similar to a `switch-case` statement. It is useful when you need to conditionally render different components depending on a specific state.

## Interface
```ts
function SwitchCase(
  value: string | number,
  caseBy: Record<string | number, () => JSX.Element>,
  defaultComponent: () => JSX.Element,
): JSX.Element;

```

### Parameters

<Interface
  required
  name="value"
  type="string | number"
  description="The value to compare against. The component associated with the matching key in <code>caseBy</code> will be rendered."
/>

<Interface
  required
  name="caseBy"
  type="Record<string | number, () => JSX.Element>"
  description="An object that maps values to components to render. The keys represent possible values, and the values are functions returning the corresponding components."
/>

<Interface
  required
  name="defaultComponent"
  type="() => JSX.Element"
  description="The component to render if <code>value</code> does not match any key in <code>caseBy</code>."
/>

### Return Value

<Interface
  name=""
  type="JSX.Element"
  description="React component that conditionally renders based on cases."
/>


## Example

```tsx
function App() {
  return (
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
  );
}
```
  