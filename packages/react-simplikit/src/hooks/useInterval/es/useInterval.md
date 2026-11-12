# useInterval

`useInterval` es un Hook de React que ejecuta una función con un intervalo especificado.
Es útil para temporizadores, consultas periódicas de datos y otras tareas recurrentes.

## Interfaz

```ts
function useInterval(options: Object): void;
```

### Parámetros

<Interface
  required
  name="options"
  type="Object"
  description="Configura el comportamiento del intervalo."
  :nested="[
    {
      name: 'options.onTick',
      type: '() => void',
      required: true,
      description: 'La función que se ejecuta periódicamente.',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      required: true,
      description: 'La duración del intervalo en milisegundos.',
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

  useInterval({
    onTick: () => setTime(prev => prev + 1),
    delayMs: 1000,
  });

  return (
    <div>
      <p>{time} segundos</p>
    </div>
  );
}
```
