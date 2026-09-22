# useCallbackOncePerRender

`useCallbackOncePerRender` es un Hook de React que garantiza que un callback se ejecute una sola vez, sin importar cuántas veces lo llames.
Te resulta útil para operaciones que solo deben ejecutarse una vez, incluso si el componente vuelve a renderizarse.

## Interfaz

```ts
function useCallbackOncePerRender<F extends (...args: any[]) => void>(
  callback: () => void,
  deps: DependencyList
): (...args: any[]) => void;
```

### Parámetros

<Interface
  required
  name="callback"
  type="() => void"
  description="El callback que debe ejecutarse una sola vez."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="Arreglo de dependencias que permite una nueva ejecución única cuando cambia."
/>

### Valor de retorno

<Interface
  name=""
  type="(...args: any[]) => void"
  description="Una función memorizada que solo se ejecutará una vez hasta que cambien las dependencias."
/>

## Ejemplo

```tsx
import { useCallbackOncePerRender } from 'react-simplikit';

function Component() {
  const handleOneTimeEvent = useCallbackOncePerRender(() => {
    console.log('Esto solo se ejecutará una vez');
  }, []);

  return <button onClick={handleOneTimeEvent}>Haz clic aquí</button>;
}
```

```tsx
// Con dependencias
function TrackingComponent({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOncePerRender(() => {
    analytics.trackVisit(userId);
  }, [userId]);

  useEffect(() => {
    trackUserVisit();
  }, [trackUserVisit]);

  return <div>Página del usuario</div>;
}
```
