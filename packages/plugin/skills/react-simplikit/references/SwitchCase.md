# SwitchCase

`SwitchCase` is a component that allows you to declaratively render components based on a given value, similar to a `switch-case` statement. It is useful when you need to conditionally render different components depending on a specific state.

## Interface

```ts
function SwitchCase(
  value: Case,
  caseBy: Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>,
  defaultComponent: () => ReactElement | null
): ReactElement | null;
```

### Parameters

<Interface
  required
  name="value"
  type="Case"
  description="The value to compare against. The component associated with the matching key in <code>caseBy</code> will be rendered."
/>

<Interface
  required
  name="caseBy"
  type="Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>"
  description="An object that maps values to components to render. The keys represent possible values, and the values are functions returning the corresponding components."
/>

<Interface
  name="defaultComponent"
  type="() => ReactElement | null"
  description="The component to render if <code>value</code> does not match any key in <code>caseBy</code>."
/>

### Return Value

<Interface
  name=""
  type="ReactElement | null"
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
