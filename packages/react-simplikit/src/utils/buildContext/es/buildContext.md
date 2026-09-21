# buildContext

`buildContext` es una función auxiliar que reduce el código repetitivo al definir un contexto de React.

## Interfaz

```ts
function buildContext<ContextValuesType extends object>(
  contextName: string,
  defaultContextValues?: ContextValuesType
): [
  Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element,
  useContext: () => ContextValuesType,
];
```

### Parámetros

<Interface
  required
  name="contextName"
  type="string"
  description="El nombre del contexto."
/>

<Interface
  name="defaultContextValues"
  type="ContextValuesType"
  description="Los valores predeterminados que pasas al contexto."
/>

### Valor de retorno

<Interface
  name=""
  type="[Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element, useContext: () => ContextValuesType]"
  description="Una tupla con la siguiente forma:"
  :nested="[
    {
      name: 'Provider',
      type: '(props: ProviderProps<ContextValuesType>) => JSX.Element',
      required: false,
      description: 'El componente que proporciona el contexto.',
    },
    {
      name: 'useContext',
      type: '() => ContextValuesType',
      required: false,
      description: 'El Hook que usa el contexto.',
    },
  ]"
/>

## Ejemplo

```tsx
const [Provider, useContext] = buildContext<{ title: string }>('TestContext', {
  title: 'Título predeterminado',
});

function Inner() {
  const { title } = useContext();
  return <div>{title}</div>;
}

function Page() {
  return (
    <Provider title="Hola">
      <Inner />
    </Provider>
  );
}
```
