# useVisibilityEvent

`useVisibilityEvent` es un Hook de React que escucha los cambios en el estado de visibilidad del documento y ejecuta un callback.

## Interfaz

```ts
function useVisibilityEvent(
  callback: (visibilityState: 'visible' | 'hidden') => void,
  options?: object
): void;
```

### Parámetros

<Interface
  required
  name="callback"
  type="(visibilityState: 'visible' | 'hidden') => void"
  description="Una función que el Hook llama cuando cambia el estado de visibilidad. Recibe como argumento el estado de visibilidad actual ('visible' o 'hidden')."
/>

<Interface
  name="options"
  type="object"
  description="Configuración opcional del Hook."
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'Si es true, el Hook ejecuta el callback inmediatamente al montar el componente, con el estado de visibilidad actual.',
    },
  ]"
/>

### Valor de retorno

Esta función no devuelve ningún valor.

## Ejemplo

```tsx
import { useVisibilityEvent } from 'react-simplikit';

function Component() {
  useVisibilityEvent(visibilityState => {
    console.log(`El estado del documento ahora es ${visibilityState}`);
  });

  return <p>Consulta los cambios de visibilidad en la consola.</p>;
}
```
