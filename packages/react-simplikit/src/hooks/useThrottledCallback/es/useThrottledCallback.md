# useThrottledCallback

`useThrottledCallback` es un Hook de React que devuelve una versión del callback proporcionado con una frecuencia de ejecución limitada.
El callback se ejecuta como máximo una vez por intervalo especificado.

## Interfaz

```ts
function useThrottledCallback<T>(
  onChange: (newValue: T) => void,
  throttleMs: number,
  options?: ThrottleOptions
): (nextValue: T) => void;
```

### Parámetros

<Interface
  required
  name="onChange"
  type="(newValue: T) => void"
  description="Función que recibe el valor."
/>

<Interface
  required
  name="throttleMs"
  type="number"
  description="Intervalo del throttle en milisegundos."
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="Opciones para configurar el comportamiento adicional."
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        'Un arreglo opcional que especifica si la función debe ejecutarse al inicio del intervalo, al final o en ambos momentos.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="(nextValue: T) => void"
  description="Una función con frecuencia limitada que transmite el valor a <code>onChange</code> como máximo una vez por intervalo."
/>

## Ejemplo

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback(setScrollTop, 200);

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Desplazamiento: {scrollTop}px</p>
    </div>
  );
}
```
