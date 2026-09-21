# useDebouncedCallback

`useDebouncedCallback` es un Hook de React que devuelve una versión con debounce del callback que proporcionas.
Te ayuda a optimizar la gestión de eventos al retrasar la ejecución de la función y agrupar varias llamadas en una sola.

Ten en cuenta que, si activas tanto “leading” como “trailing”, la función se ejecutará al inicio y al final del período de espera. Sin embargo, para que esto ocurra, debes llamarla al menos dos veces dentro del intervalo debounceMs, ya que una sola llamada a la función con debounce no puede provocar dos ejecuciones.

## Interfaz

```ts
function useDebouncedCallback<T>(options: Object): (nextValue: T) => void;
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
        'El callback al que quieres aplicar debounce. Las llamadas con el mismo valor que el último enviado se omiten.',
    },
    {
      name: 'options.timeThreshold',
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
  type="(nextValue: T) => void"
  description="Una función con debounce que envía el valor a <code>onChange</code>."
/>

## Ejemplo

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback({
    onChange: setQuery,
    timeThreshold: 300,
  });

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <p>Buscando: {query}</p>
    </>
  );
}
```
