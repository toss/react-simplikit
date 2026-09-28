# useDebouncedCallback

`useDebouncedCallback` es un Hook de React que devuelve una versión con debounce del callback que proporcionas.
Te ayuda a optimizar la gestión de eventos al retrasar la ejecución de la función y agrupar varias llamadas en una sola.

Ten en cuenta que, si activas tanto “leading” como “trailing”, la función se ejecutará al inicio y al final del período de espera. Sin embargo, para que esto ocurra, debes llamarla al menos dos veces dentro del intervalo debounceMs, ya que una sola llamada a la función con debounce no puede provocar dos ejecuciones.

## Interfaz

```ts
function useDebouncedCallback<T>(
  onChange: (newValue: T) => void,
  debounceMs: number,
  options?: DebounceOptions
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
  name="debounceMs"
  type="number"
  description="Retraso del debounce en milisegundos."
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="Opciones para configurar el comportamiento adicional."
  :nested="[
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
  type="(nextValue: T) => void"
  description="Una función con debounce que envía el valor a <code>onChange</code>."
/>

## Ejemplo

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback(setQuery, 300);

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <p>Buscando: {query}</p>
    </>
  );
}
```
