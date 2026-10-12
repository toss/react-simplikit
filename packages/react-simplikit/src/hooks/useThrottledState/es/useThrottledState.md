# useThrottledState

`useThrottledState` es un Hook de React que gestiona el estado y devuelve un setter con limitación de frecuencia.
Con las opciones predeterminadas, la primera llamada al setter se aplica inmediatamente y las llamadas posteriores
se limitan en frecuencia según `throttleMs`, con el último valor pendiente aplicado en el extremo final (trailing).
Es útil para limitar las actualizaciones de estado provocadas por eventos frecuentes, como el desplazamiento.

El valor inicial se devuelve tal cual en el primer renderizado y en el servidor. No se programa ninguna actualización
al montar el componente, por lo que, con `leading: true`, la primera llamada al setter después del montaje se aplica inmediatamente.
Si tanto `leading` como `trailing` son `false`, el estado nunca se actualiza.

Las actualizaciones pendientes se cancelan cuando el componente se desmonta o cuando cambian `throttleMs`, `leading` o `trailing`.

## Interfaz

```ts
function useThrottledState<T>(
  initialValue: T,
  throttleMs: number,
  options?: ThrottleOptions
): [state: T, setState: (nextValue: T) => void];
```

### Parámetros

<Interface
  required
  name="initialValue"
  type="T"
  description="El valor inicial del estado, que solo se usa en el primer renderizado."
/>

<Interface
  required
  name="throttleMs"
  type="number"
  description="La duración de la ventana de limitación de frecuencia, en milisegundos."
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="Opciones de configuración de la limitación de frecuencia."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, permite una actualización inmediata al inicio de una ventana de limitación de frecuencia.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Si es <code>true</code>, permite ejecutar una actualización pendiente con el valor más reciente una vez transcurrida la espera.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="[state: T, setState: (nextValue: T) => void]"
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
      type: '(nextValue: T) => void',
      required: false,
      description: 'Un setter con limitación de frecuencia que recibe el siguiente valor del estado.',
    },
  ]"
/>

## Ejemplo

```tsx
import { useThrottledState } from 'react-simplikit';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useThrottledState(0, 200);

  return (
    <div onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
