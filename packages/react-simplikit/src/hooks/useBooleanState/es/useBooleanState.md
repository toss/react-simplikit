# useBooleanState

`useBooleanState` es un Hook de React que te permite gestionar un estado booleano de forma sencilla.
Proporciona funciones para establecer el estado en `true`, establecerlo en `false` y alternar su valor.

## Interfaz

```ts
function useBooleanState(
  initialValue: boolean | (() => boolean) = false
): readonly [
  state: boolean,
  setTrue: () => void,
  setFalse: () => void,
  toggle: () => void,
];
```

### Parámetros

<Interface
  name="initialValue"
  type="boolean | (() => boolean)"
  description="El valor inicial del estado. El valor predeterminado es <code>false</code>."
/>

### Valor de retorno

<Interface
  name=""
  type="readonly [state: boolean, setTrue: () => void, setFalse: () => void, toggle: () => void]"
  description="Una tupla que contiene:"
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      required: false,
      description: 'El valor actual del estado.',
    },
    {
      name: 'setTrue',
      type: '() => void',
      required: false,
      description: 'Una función para establecer el estado en <code>true</code>.',
    },
    {
      name: 'setFalse',
      type: '() => void',
      required: false,
      description: 'Una función para establecer el estado en <code>false</code>.',
    },
    {
      name: 'toggle',
      type: '() => void',
      required: false,
      description: 'Una función para alternar el estado.',
    },
  ]"
/>

## Ejemplo

```tsx
const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] =
  useBooleanState(false);
```
