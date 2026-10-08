# useTimeout

`useTimeout` es un Hook de React que ejecuta un callback tras un tiempo de espera especificado.
Gestiona `setTimeout` de acuerdo con el ciclo de vida de React y garantiza la limpieza al desmontar el componente o cuando cambian las dependencias.

## Interfaz

```ts
function useTimeout(options: Object): void;
```

### Parámetros

<Interface
  required
  name="options"
  type="Object"
  description="Configura el comportamiento del tiempo de espera."
  :nested="[
    {
      name: 'options.onTimeout',
      type: '() => void',
      required: true,
      description: 'La función que el Hook ejecuta tras el tiempo de espera.',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: 'El tiempo en milisegundos que debe transcurrir antes de ejecutar <code>onTimeout</code>.',
    },
  ]"
/>

### Valor de retorno

Esta función no devuelve ningún valor.

## Ejemplo

```tsx
// Actualizar un título tras un tiempo de espera
import { useTimeout } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [title, setTitle] = useState('');

  useTimeout({
    onTimeout: () => setTitle('Buscando productos...'),
    delayMs: 2000,
  });

  useTimeout({
    onTimeout: () => setTitle('Casi listo...'),
    delayMs: 4000,
  });

  return <div>{title}</div>;
}
```
