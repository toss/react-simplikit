# buildContext

`buildContext` is a helper function that reduces repetitive code when defining React Context.

## Interface

```ts
function buildContext<T>(contextName: string, defaultContextValues: T): [React.Provider<T>, () => T];
```

## Parameters

- `contextName`: The name of the context.
- `defaultContextValues`: The default values to be passed to the context.

## Return value

- `Provider`: The component that provides the context.
- `useContext`: The hook that uses the context.

## Example

```tsx
const [Provider, useContext] = buildContext<{ title: string }>('TestContext', null);

function Inner() {
  const context = useContext();

  return <h1>{context.title}</h1>;
}

function Page() {
  return (
    <Provider title="Title">
      <Inner />
    </Provider>
  );
}
```
