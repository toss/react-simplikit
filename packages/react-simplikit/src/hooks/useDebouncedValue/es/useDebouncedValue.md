# useDebouncedValue

`useDebouncedValue` es un Hook de React que devuelve una copia con debounce del valor que proporcionas.
Mantienes el control del estado; el Hook solo retrasa la actualización del valor devuelto para que refleje ese estado.
El valor devuelto se actualiza `wait` milisegundos después del último cambio, lo que te resulta útil
para obtener una consulta de búsqueda o un valor para validar a partir de un estado que cambia rápidamente.

Las actualizaciones pendientes se cancelan cuando el componente se desmonta. El ejemplo muestra la
consulta con retraso sin necesitar un servicio de búsqueda ni un componente adicional.

En el primer renderizado y en el servidor, el valor se devuelve sin cambios. Nunca se programa un cambio
al montar el componente, por lo que, con `leading: true`, el primer cambio posterior al montaje se aplica de inmediato.
Si tanto `leading` como `trailing` son `false`, el valor devuelto nunca se actualiza.

El valor se compara por referencia. Si pasas un objeto o arreglo nuevo en cada renderizado,
el valor devuelto seguirá actualizándose cada `wait` milisegundos; estabiliza primero la referencia,
por ejemplo, con `usePreservedReference`.

## Interfaz

```ts
function useDebouncedValue<T>(
  value: T,
  wait: number,
  options?: DebounceOptions
): T;
```

### Parámetros

<Interface
  required
  name="value"
  type="T"
  description="El valor al que quieres aplicar debounce."
/>

<Interface
  required
  name="wait"
  type="number"
  description="El número de milisegundos de espera desde el último cambio antes de actualizar el valor."
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
        'Si es <code>true</code>, el primer cambio después de un período de inactividad se aplica de inmediato.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, el último cambio se aplica después de <code>wait</code> milisegundos.',
    },
  ]"
/>

### Valor de retorno

<Interface name="" type="T" description="El valor con debounce." />

## Ejemplo

```tsx
import { useDebouncedValue } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  return (
    <>
      <label>
        Buscar
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <output aria-live="polite">{debouncedQuery}</output>
    </>
  );
}
```
