# useList

Un Hook de React que gestiona un arreglo como estado.
Proporciona una gestión eficiente del estado y funciones de acción estables.

## Interfaz

```ts
function useList<T>(initialState: T[] = []): UseListReturn<T>;
```

### Parámetros

<Interface name="initialState" type="T[]" description="Estado inicial del arreglo." />

### Valor de retorno

<Interface
  name=""
  type="UseListReturn<T>"
  description="Un objeto que contiene el estado del arreglo y las acciones para manipularlo."
  :nested="[
    {
      name: 'list',
      type: 'ReadonlyArray<T>',
      required: false,
      description: 'El estado actual del arreglo.',
    },
    {
      name: 'push',
      type: '(value: T) => void',
      required: false,
      description: 'Añade un valor al final de la lista.',
    },
    {
      name: 'insertAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: 'Inserta un valor en el índice especificado.',
    },
    {
      name: 'updateAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: 'Actualiza el valor en el índice especificado.',
    },
    {
      name: 'removeAt',
      type: '(index: number) => void',
      required: false,
      description: 'Elimina el valor en el índice especificado.',
    },
    {
      name: 'setAll',
      type: '(values: T[]) => void',
      required: false,
      description: 'Reemplaza toda la lista por un nuevo arreglo.',
    },
    {
      name: 'reset',
      type: '() => void',
      required: false,
      description: 'Restablece la lista a su estado inicial.',
    },
  ]"
/>

## Ejemplo

```tsx
const { list, push, insertAt, updateAt, removeAt, setAll, reset } =
  useList<string>(['apple', 'banana']);

// Añadir un elemento
push('cherry');

// Insertar en un índice
insertAt(1, 'grape');

// Actualizar en un índice
updateAt(0, 'orange');

// Eliminar en un índice
removeAt(2);

// Reemplazar todo
setAll(['kiwi', 'mango']);

// Restablecer al estado inicial
reset();
```
