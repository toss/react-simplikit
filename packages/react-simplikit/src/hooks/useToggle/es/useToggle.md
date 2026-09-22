# useToggle

`useToggle` es un Hook de React que simplifica la gestión de un estado booleano.
Proporciona una función para alternar el estado entre `true` y `false`.

## Interfaz

```ts
function useToggle(
  initialValue: boolean = false
): [state: boolean, toggle: () => void];
```

### Parámetros

<Interface
  name="initialValue"
  type="boolean"
  description="El valor inicial del estado. El valor predeterminado es <code>false</code>."
/>

### Valor de retorno

<Interface
  name=""
  type="[state: boolean, toggle: () => void]"
  description="Una tupla:"
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      required: false,
      description: 'El valor actual del estado.',
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
import { useToggle } from 'react-simplikit';

function Component() {
  const [open, toggle] = useToggle(false);

  return (
    <div>
      <p>Estado del panel inferior: {open ? 'abierto' : 'cerrado'}</p>
      <button onClick={toggle}>Alternar</button>
    </div>
  );
}
```
