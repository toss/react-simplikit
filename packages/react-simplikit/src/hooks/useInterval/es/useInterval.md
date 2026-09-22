# useInterval

`useInterval` es un Hook de React que ejecuta una función con un intervalo especificado.
Es útil para temporizadores, consultas periódicas de datos y otras tareas recurrentes.

## Interfaz

```ts
function useInterval(
  callback: () => void,
  options: number | { delay: number; enabled?: boolean; immediate?: boolean }
): void;
```

### Parámetros

<Interface
  required
  name="callback"
  type="() => void"
  description="La función que se ejecuta periódicamente."
/>

<Interface
  required
  name="options"
  type="number | { delay: number; enabled?: boolean; immediate?: boolean }"
  description="Configura el comportamiento del intervalo."
  :nested="[
    {
      name: 'options.delay',
      type: 'number',
      required: true,
      description:
        'La duración del intervalo en milisegundos. Si es <code>null</code>, el intervalo no se ejecuta.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'Si es <code>true</code>, ejecuta la función inmediatamente antes de iniciar el intervalo.',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: 'Si es <code>false</code>, el intervalo no se ejecuta.',
    },
  ]"
/>

### Valor de retorno

Esta función no devuelve ningún valor.

## Ejemplo

```tsx
import { useInterval } from 'react-simplikit';
import { useState } from 'react';

function Timer() {
  const [time, setTime] = useState(0);

  useInterval(() => {
    setTime(prev => prev + 1);
  }, 1000);

  return (
    <div>
      <p>{time} segundos</p>
    </div>
  );
}
```
