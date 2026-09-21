# useThrottledValue

`useThrottledValue` es un Hook de React que devuelve una copia del valor dado con una frecuencia de actualización limitada.
Tú mantienes el control del estado; el valor devuelto refleja sus cambios como máximo una vez cada `wait` milisegundos.
Esto te permite limitar los renderizados costosos que dependen de la posición de desplazamiento, la posición del puntero
o el tamaño de un elemento cuando cambia.

En el primer renderizado y en el servidor, el Hook devuelve el valor tal cual. Nunca programa un cambio
al montar el componente, por lo que aplica inmediatamente el primer cambio posterior al montaje cuando `leading` es `true`.
Si tanto `leading` como `trailing` son `false`, el valor devuelto nunca se actualiza.

El Hook compara el valor por referencia. Si pasas un objeto o arreglo nuevo en cada renderizado,
el valor devuelto sigue actualizándose cada `wait` milisegundos; primero estabiliza la referencia,
por ejemplo, con `usePreservedReference`.

## Interfaz

```ts
function useThrottledValue<T>(
  value: T,
  wait: number,
  options?: ThrottleOptions
): T;
```

### Parámetros

<Interface
  required
  name="value"
  type="T"
  description="El valor cuya frecuencia de actualización quieres limitar."
/>

<Interface
  required
  name="wait"
  type="number"
  description="La duración del intervalo de limitación de frecuencia, en milisegundos."
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="Opciones para configurar la limitación de frecuencia."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, el Hook aplica inmediatamente el primer cambio de cada intervalo.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, el Hook aplica el último cambio de un intervalo <code>wait</code> milisegundos después de ese cambio.',
    },
  ]"
/>

### Valor de retorno

<Interface name="" type="T" description="El valor con frecuencia de actualización limitada." />

## Ejemplo

```tsx
import { useThrottledValue } from 'react-simplikit';
import { useState } from 'react';

function ScrollProgress() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottledValue(scrollY, 100);

  return (
    <div onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
      <ProgressBar position={throttledScrollY} />
    </div>
  );
}
```
