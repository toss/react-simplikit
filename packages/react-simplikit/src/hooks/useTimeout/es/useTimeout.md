# useTimeout

`useTimeout` es un Hook de React que ejecuta un callback tras un tiempo de espera especificado.
Gestiona `setTimeout` de acuerdo con el ciclo de vida de React y garantiza la limpieza al desmontar el componente o cuando cambian las dependencias.

## Interfaz

```ts
function useTimeout(callback: () => void, delay: number = 0): void;
```

### Parámetros

<Interface
  required
  name="callback"
  type="() => void"
  description="La función que el Hook ejecuta tras el tiempo de espera."
/>

<Interface
  name="delay"
  type="number"
  description="El tiempo en milisegundos que debe transcurrir antes de ejecutar el callback."
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

  useTimeout(() => {
    setTitle('Buscando productos...');
  }, 2000);

  useTimeout(() => {
    setTitle('Casi listo...');
  }, 4000);

  return <div>{title}</div>;
}
```
