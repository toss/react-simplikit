# buildContext

`buildContext` is a helper function that reduces repetitive code when defining React Context.

## Interface

```ts
function buildContext(
  contextName: string,
  defaultContextValues: ContextValuesType
): [
  Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element,
  useContext: () => ContextValuesType,
];
```

### Parameters

<Interface
  required
  name="contextName"
  type="string"
  description="The name of the context."
/>

<Interface
  name="defaultContextValues"
  type="ContextValuesType"
  description="The default values to be passed to the context."
/>

### Return Value

<Interface
  name=""
  type="[Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element, useContext: () => ContextValuesType]"
  description="tuple of the form :"
  :nested="[
    {
      name: 'Provider',
      type: '(props: ProviderProps<ContextValuesType>) => JSX.Element',
      description: 'The component that provides the context.',
    },
    {
      name: 'useContext',
      type: '() => ContextValuesType',
      description: 'The hook that uses the context.',
    },
  ]"
/>

## Example

```tsx
const [Provider, useContext] = buildContext<{ title: string }>(
  'TestContext',
  null
);

function Inner() {
  const { title } = useContext();
  return <div>{title}</div>;
}

function Page() {
  return (
    <Provider title="Hello">
      <Inner />
    </Provider>
  );
}
```
