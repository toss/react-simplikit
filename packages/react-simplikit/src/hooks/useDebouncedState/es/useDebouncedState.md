# useDebouncedState

`useDebouncedState` es un Hook de React que gestiona el estado y devuelve una función de actualización con debounce. Con las opciones predeterminadas, el estado se actualiza `debounceMs` milisegundos después de tu última llamada a la función de actualización. Es útil para aplicar solo el último valor de una serie de solicitudes de actualización rápidas, como las de un campo de búsqueda.

El valor inicial se devuelve sin cambios en el primer renderizado y en el servidor. No se programa ninguna actualización al montar el componente, por lo que, con `leading: true`, tu primera llamada a la función de actualización después del montaje se aplica de inmediato. Si tanto `leading` como `trailing` son `false`, el estado nunca se actualiza.

Las actualizaciones pendientes se cancelan cuando el componente se desmonta o cuando cambian `debounceMs`, `leading` o `trailing`.

## Interfaz

```ts
function useDebouncedState<T>(
  initialValue: T,
  debounceMs: number,
  options?: DebounceOptions
): [state: T, setState: Dispatch<SetStateAction<T>>];
```

### Parámetros

<Interface
  required
  name="initialValue"
  type="T"
  description="El valor inicial del estado, que solo se utiliza en el primer renderizado."
/>

<Interface
  required
  name="debounceMs"
  type="number"
  description="El tiempo de espera en milisegundos desde tu última llamada a la función de actualización hasta que se actualiza el estado."
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
        'Si es <code>true</code>, tu primera llamada a la función de actualización después de un período de inactividad se aplica de inmediato.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, el último valor se aplica después de <code>debounceMs</code> milisegundos.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="[state: T, setState: Dispatch<SetStateAction<T>>]"
  description="Una tupla:"
  :nested="[
    {
      name: 'state',
      type: 'T',
      required: false,
      description: 'El valor actual del estado.',
    },
    {
      name: 'setState',
      type: 'Dispatch<SetStateAction<T>>',
      required: false,
      description: 'Una función de actualización con debounce que acepta el siguiente valor del estado o una función de actualización.',
    },
  ]"
/>

## Ejemplo

```tsx
import { useDebouncedState } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useDebouncedState('', 300);

  return (
    <>
      <label>
        Search
        <input onChange={event => setQuery(event.target.value)} />
      </label>
      <output aria-live="polite">{query}</output>
    </>
  );
}
```
