# useStorageState

`useStorageState` es un Hook de React que funciona como `useState`, pero conserva el valor del estado en el almacenamiento del navegador.
El valor persiste cuando recargas la página y puedes compartirlo entre pestañas al usar `localStorage`.

Si no pasas `serializer` y `deserializer`, el valor se guarda como JSON y debe poder serializarse a JSON en todos sus niveles: si contiene en cualquier parte un `Date`, un `Map`, una instancia de clase o una función, se lanza un error al establecer el valor, y `defaultValue` se comprueba al montar el componente. Para guardar cualquier otro tipo, pasa ambas funciones. La cadena guardada no se valida al volver a leerla. El valor leído se reutiliza hasta que cambia la cadena guardada, así que llama a `refresh` cuando `deserializer` cambie lo que devuelve.

## Interfaz

```ts
function useStorageState<T>(
  key: string,
  options?: Object
): readonly [state: T | undefined, actions: StorageStateActions<T | undefined>];
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
      type: '(value: T) => string',
      required: false,
      description: 'Convierte el valor en una cadena. Pasa esta función junto con <code>deserializer</code>.',
    },
    {
      name: 'options.deserializer',
      type: '(value: string) => T',
      required: false,
      description: 'Convierte la cadena guardada de nuevo en un valor. Pasa esta función junto con <code>serializer</code>.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="readonly [state: T | undefined, actions: StorageStateActions<T | undefined>]"
  description="Una tupla con el estado y las acciones para cambiarlo."
  :nested="[
    {
      name: 'state',
      type: 'T | undefined',
      required: false,
      description: 'El valor actual del estado obtenido del almacenamiento. Es <code>T</code> cuando pasas <code>defaultValue</code>.',
    },
    {
      name: 'actions.setValue',
      type: '(value: SetStateAction<T | undefined>) => void',
      required: false,
      description: 'Una función para actualizar y guardar el estado de forma persistente.',
    },
    {
      name: 'actions.refresh',
      type: '() => void',
      required: false,
      description: 'Una función para volver a leer el valor del almacenamiento sin escribir en él.',
    },
  ]"
/>

## Ejemplo

```tsx
// Contador con estado persistente
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, { setValue }] = useStorageState('counter', {
    defaultValue: 0,
  });

  return (
    <button onClick={() => setValue(prev => prev + 1)}>Conteo: {count}</button>
  );
}
```
