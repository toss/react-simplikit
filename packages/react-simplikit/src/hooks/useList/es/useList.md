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
  description="Una tupla que contiene el estado del arreglo y las acciones para manipularlo."
  :nested="[
    {
      name: 'list',
      type: 'ReadonlyArray<T>',
      required: false,
      description: 'El estado actual del arreglo.',
    },
    {
      name: 'actions.push',
      type: '(value: T) => void',
      required: false,
      description: 'Añade un valor al final de la lista.',
    },
    {
      name: 'actions.insertAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: 'Inserta un valor en el índice especificado.',
    },
    {
      name: 'actions.updateAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: 'Actualiza el valor en el índice especificado.',
    },
    {
      name: 'actions.removeAt',
      type: '(index: number) => void',
      required: false,
      description: 'Elimina el valor en el índice especificado.',
    },
    {
      name: 'actions.setAll',
      type: '(values: T[]) => void',
      required: false,
      description: 'Reemplaza toda la lista por un nuevo arreglo.',
    },
    {
      name: 'actions.reset',
      type: '() => void',
      required: false,
      description: 'Restablece la lista a su estado inicial.',
    },
  ]"
/>

## Ejemplo

```tsx
const [list, actions] = useList<string>(['apple', 'banana']);

// Añadir un elemento
actions.push('cherry');

// Insertar en un índice
actions.insertAt(1, 'grape');

// Actualizar en un índice
actions.updateAt(0, 'orange');

// Eliminar en un índice
actions.removeAt(2);

// Reemplazar todo
actions.setAll(['kiwi', 'mango']);

// Restablecer al estado inicial
actions.reset();
```
