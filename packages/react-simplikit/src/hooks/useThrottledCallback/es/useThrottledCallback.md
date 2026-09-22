# useThrottledCallback

`useThrottledCallback` es un Hook de React que devuelve una versión del callback proporcionado con una frecuencia de ejecución limitada.
El callback se ejecuta como máximo una vez por intervalo especificado.

## Interfaz

```ts
function useThrottledCallback<T>(options: Object): (nextValue: T) => void;
```

### Parámetros

<Interface
  required
  name="options"
  type="Object"
  description="El objeto de opciones."
  :nested="[
    {
      name: 'options.onChange',
      type: '(newValue: T) => void',
      required: true,
      description:
        'El callback cuya frecuencia de ejecución quieres limitar. El Hook omite las llamadas con el mismo valor que el último que transmitió.',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: true,
      description: 'El intervalo en milisegundos que limita la frecuencia de las llamadas.',
    },
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
  const setScrollTopThrottled = useThrottledCallback({
    onChange: setScrollTop,
    timeThreshold: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Desplazamiento: {scrollTop}px</p>
    </div>
  );
}
```
