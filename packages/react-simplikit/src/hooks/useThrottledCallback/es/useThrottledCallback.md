# useThrottledCallback

`useThrottledCallback` es un Hook de React que devuelve una versión del callback proporcionado con una frecuencia de ejecución limitada.
El callback se ejecuta como máximo una vez por intervalo especificado.
La función resultante recibe los mismos argumentos que `callback`, y la llamada que se ejecuta al terminar la espera usa los argumentos de la llamada más reciente.

Las llamadas pendientes se cancelan cuando el componente se desmonta o cuando cambia `throttleMs`, `leading` o `trailing`.
Cuando llamas a `.cancel()`, solo cancelas la llamada pendiente; no detienes el trabajo que `callback` ya haya comenzado.
La siguiente llamada después de `.cancel()` inicia un nuevo intervalo, así que se ejecuta de inmediato si `leading` es `true`.

## Interfaz

```ts
function useThrottledCallback<F extends (...args: any[]) => unknown>(
  options: Object
): ((...args: Parameters<F>) => void) & { cancel: () => void };
```

### Parámetros

<Interface
  required
  name="options"
  type="Object"
  description="El objeto de opciones."
  :nested="[
    {
      name: 'options.callback',
      type: 'F',
      required: true,
      description: 'La función cuya frecuencia de ejecución quieres limitar.',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: true,
      description: 'El intervalo en milisegundos que limita la frecuencia de las llamadas.',
    },
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, permite una llamada inmediata al inicio del intervalo de limitación de frecuencia.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, permite ejecutar una llamada pendiente después de la espera con los argumentos más recientes.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="((...args: Parameters<F>) => void) & { cancel: () => void }"
  description="Una función con frecuencia limitada que recibe los mismos argumentos que <code>callback</code>. También incluye un método <code>cancel</code> para cancelar cualquier ejecución pendiente."
/>

## Ejemplo

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback({
    callback: setScrollTop,
    throttleMs: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Desplazamiento: {scrollTop}px</p>
    </div>
  );
}
```
