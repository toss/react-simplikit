# useCallbackOnce

`useCallbackOnce` es un Hook de React que ejecuta un callback una sola vez hasta que cambie `deps`, sin importar cuántas veces llames a la función que devuelve.
Te resulta útil para operaciones que solo deben ejecutarse una vez, incluso si el componente vuelve a renderizarse.
En v0 este Hook se llamaba `useCallbackOncePerRender`. El nombre anterior sigue funcionando, pero está obsoleto.

## Interfaz

```ts
function useCallbackOnce<F extends (...args: any[]) => void>(
  callback: F,
  deps: DependencyList
): (...args: Parameters<F>) => void;
```

### Parámetros

<Interface
  required
  name="callback"
  type="F"
  description="El callback que debe ejecutarse una sola vez. Recibe los argumentos que pasas a la función devuelta."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="Arreglo de dependencias. Cuando cambia, la función devuelta puede ejecutar el callback una vez más."
/>

### Valor de retorno

<Interface
  name=""
  type="(...args: Parameters<F>) => void"
  description="Una función cuya referencia nunca cambia. Ejecuta el callback una sola vez hasta que cambie <code>deps</code>."
/>

## Ejemplo

```tsx
import { useCallbackOnce } from 'react-simplikit';

function Component() {
  const handleOneTimeEvent = useCallbackOnce(() => {
    console.log('Esto solo se ejecutará una vez');
  }, []);

  return <button onClick={handleOneTimeEvent}>Haz clic aquí</button>;
}
```

```tsx
// Con dependencias
function TrackingComponent({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOnce(() => {
    analytics.trackVisit(userId);
  }, [userId]);

  useEffect(() => {
    trackUserVisit();
  }, [trackUserVisit, userId]);

  return <div>Página del usuario</div>;
}
```
