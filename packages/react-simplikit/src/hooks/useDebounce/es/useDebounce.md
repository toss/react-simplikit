# useDebounce

`useDebounce` es un Hook de React que devuelve una versión con debounce del callback que proporcionas.
Te ayuda a optimizar la gestión de eventos al retrasar la ejecución de la función y agrupar varias llamadas en una sola.

Con las opciones predeterminadas, la última llamada se ejecuta después de que transcurran `wait` milisegundos sin otra llamada.
Las llamadas pendientes se cancelan cuando el componente se desmonta o cuando cambia `wait`, `leading` o `trailing`.
Cuando llamas a `.cancel()`, solo cancelas un callback pendiente, no una solicitud de red que ya haya comenzado.
El ejemplo muestra la consulta de forma local. Para buscar en un servidor, pasa el callback
de búsqueda de tu aplicación como primer argumento a `useDebounce`.

## Interfaz

```ts
function useDebounce<F extends (...args: any[]) => unknown>(
  callback: F,
  wait: number,
  options?: DebounceOptions
): F & { cancel: () => void };
```

### Parámetros

<Interface
  required
  name="callback"
  type="F"
  description="La función a la que quieres aplicar debounce."
/>

<Interface
  required
  name="wait"
  type="number"
  description="El número de milisegundos que debe retrasarse la ejecución de la función."
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="Opciones de configuración del comportamiento de debounce."
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
  type="F & { cancel: () => void }"
  description="Una función con debounce que retrasa la ejecución del callback. También incluye un método <code>cancel</code> para cancelar cualquier ejecución pendiente de debounce."
/>

## Ejemplo

```tsx
import { useState } from 'react';
import { useDebounce } from 'react-simplikit';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const debouncedSearch = useDebounce(setSubmittedQuery, 300);

  return (
    <section>
      <label>
        Buscar
        <input
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            debouncedSearch(event.target.value);
          }}
        />
      </label>
      <output aria-live="polite">{submittedQuery}</output>
      <button type="button" onClick={() => debouncedSearch.cancel()}>
        Cancelar actualización pendiente
      </button>
    </section>
  );
}
```
