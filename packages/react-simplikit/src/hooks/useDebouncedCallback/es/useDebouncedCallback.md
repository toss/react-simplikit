# useDebouncedCallback

`useDebouncedCallback` es un Hook de React que devuelve una versión con debounce del callback que proporcionas.
Te ayuda a optimizar la gestión de eventos al retrasar la ejecución de la función y agrupar varias llamadas en una sola.
La función con debounce recibe los mismos argumentos que `callback` y le transmite los de la última llamada.

Ten en cuenta que, si activas tanto “leading” como “trailing”, la función se ejecutará al inicio y al final del período de espera. Sin embargo, para que esto ocurra, debes llamarla al menos dos veces dentro del intervalo debounceMs, ya que una sola llamada a la función con debounce no puede provocar dos ejecuciones.

Las llamadas pendientes se cancelan cuando el componente se desmonta o cuando cambia `debounceMs`, `leading` o `trailing`.
Cuando llamas a `.cancel()`, solo cancelas la llamada pendiente; no detienes el trabajo que `callback` ya haya comenzado.
La siguiente llamada después de `.cancel()` inicia una nueva secuencia, así que se ejecuta de inmediato si `leading` es `true`.

## Interfaz

```ts
function useDebouncedCallback<F extends (...args: any[]) => unknown>(
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
      description: 'La función a la que quieres aplicar debounce.',
    },
    {
      name: 'options.debounceMs',
      type: 'number',
      required: true,
      description:
        'El número de milisegundos que debe retrasarse la ejecución de la función.',
    },
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'Si es <code>true</code>, la función se ejecuta al inicio de la secuencia.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, la función se ejecuta al final de la secuencia.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="((...args: Parameters<F>) => void) & { cancel: () => void }"
  description="Una función con debounce que recibe los mismos argumentos que <code>callback</code>. También incluye un método <code>cancel</code> para cancelar cualquier ejecución pendiente."
/>

## Ejemplo

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback({
    callback: setQuery,
    debounceMs: 300,
  });

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <button type="button" onClick={() => setQueryDebounced.cancel()}>
        Cancelar la actualización pendiente
      </button>
      <p>Buscando: {query}</p>
    </>
  );
}
```
