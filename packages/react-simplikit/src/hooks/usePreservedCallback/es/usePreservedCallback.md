# usePreservedCallback

`usePreservedCallback` es un Hook de React que mantiene una referencia estable a un callback
y garantiza que siempre tenga acceso al estado o las props más recientes. Esto evita renderizados innecesarios
y simplifica la gestión de dependencias cuando pasas callbacks a componentes hijos o gestionas escuchas de eventos.

## Interfaz

```ts
function usePreservedCallback<
  Arguments extends any[] = any[],
  ReturnValue = unknown,
>(callback: (...args: any[]) => any): (...args: any[]) => any;
```

### Parámetros

<Interface
  required
  name="callback"
  type="(...args: any[]) => any"
  description="La función que quieres preservar. Siempre hace referencia al estado o las props más recientes, incluso cuando el componente vuelve a renderizarse."
/>

### Valor de retorno

<Interface
  name=""
  type="(...args: any[]) => any"
  description="Una función con la misma firma que el callback de entrada. La función devuelta mantiene una referencia estable y accede al estado o las props más recientes."
/>

## Ejemplo

```tsx
import { usePreservedCallback } from 'react-simplikit';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = usePreservedCallback(() => {
    console.log(`Contador actual: ${count}`);
    setCount(prev => prev + 1);
  });

  return <button onClick={handleClick}>Haz clic aquí</button>;
}
```
