# useAsyncEffect

`useAsyncEffect` es un Hook de React que te permite gestionar efectos secundarios asíncronos en componentes de React.
Sigue el mismo patrón de limpieza que `useEffect` y garantiza una gestión segura de las operaciones asíncronas.

## Interfaz

```ts
function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps?: DependencyList
): void;
```

### Parámetros

<Interface
  required
  name="effect"
  type="() => Promise<void | (() => void)>"
  description="Una función asíncrona que sigue el patrón de ejecución de <code>useEffect</code>. Esta función puede devolver opcionalmente una función de limpieza."
/>

<Interface
  name="deps"
  type="DependencyList"
  description="Un arreglo de dependencias. El efecto vuelve a ejecutarse cada vez que cambia un valor de este arreglo. Si lo omites, el efecto se ejecuta después de cada renderizado del componente."
/>

### Valor de retorno

Esta función no devuelve ningún valor.

## Ejemplo

```tsx
useAsyncEffect(async () => {
  const data = await fetchData();
  setData(data);

  return () => {
    console.log('Limpieza al desmontar o cambiar las dependencias');
  };
}, [dependencies]);
```
