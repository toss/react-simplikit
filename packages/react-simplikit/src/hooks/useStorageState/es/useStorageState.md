# useStorageState

`useStorageState` es un Hook de React que funciona como `useState`, pero conserva el valor del estado en el almacenamiento del navegador.
El valor persiste cuando recargas la página y puedes compartirlo entre pestañas al usar `localStorage`.

## Interfaz

```ts
function useStorageState<T>(
  key: string,
  options?: Object
): readonly [
  state: Serializable<T> | undefined,
  setState: (value: SetStateAction<Serializable<T> | undefined>) => void,
  refreshState: () => void,
];
```

### Parámetros

<Interface
  required
  name="key"
  type="string"
  description="La clave con la que guardas el valor en el almacenamiento."
/>

<Interface
  name="options"
  type="Object"
  description="Opciones para configurar el comportamiento del almacenamiento."
  :nested="[
    {
      name: 'options.storage',
      type: 'Storage',
      required: false,
      defaultValue: 'localStorage',
      description:
        'El tipo de almacenamiento (<code>localStorage</code> o <code>sessionStorage</code>). El valor predeterminado es <code>localStorage</code>.',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      required: false,
      description: 'El valor inicial si no hay ningún valor guardado.',
    },
    {
      name: 'options.serializer',
      type: 'Function',
      required: false,
      description: 'Una función para serializar el valor del estado como una cadena.',
    },
    {
      name: 'options.deserializer',
      type: 'Function',
      required: false,
      description: 'Una función para deserializar el valor del estado a partir de una cadena.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="readonly [state: Serializable<T> | undefined, setState: (value: SetStateAction<Serializable<T> | undefined>) => void, refreshState: () => void]"
  description="Una tupla:"
  :nested="[
    {
      name: 'state',
      type: 'Serializable<T> | undefined',
      required: false,
      description: 'El valor actual del estado obtenido del almacenamiento.',
    },
    {
      name: 'setState',
      type: '(value: SetStateAction<Serializable<T> | undefined>) => void',
      required: false,
      description: 'Una función para actualizar y guardar el estado de forma persistente.',
    },
    {
      name: 'refreshState',
      type: '() => void',
      required: false,
      description: 'Una función para actualizar el estado a partir del almacenamiento.',
    },
  ]"
/>

## Ejemplo

```tsx
// Contador con estado persistente
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return (
    <button onClick={() => setCount(prev => prev + 1)}>Conteo: {count}</button>
  );
}
```
