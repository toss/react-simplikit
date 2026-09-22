# useConditionalEffect

`useConditionalEffect` es un Hook de React que ejecuta efectos de forma condicional según una función de predicado.
Te permite controlar cuándo se ejecutan los efectos con criterios adicionales a los cambios en las dependencias.

## Interfaz

```ts
function useConditionalEffect<T extends DependencyList>(
  effect: EffectCallback,
  deps: DependencyList,
  condition: (prevDeps: T | undefined, currentDeps: T) => boolean
): void;
```

### Parámetros

<Interface
  required
  name="effect"
  type="EffectCallback"
  description="El callback del efecto que debe ejecutarse."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="Arreglo de dependencias, similar al de useEffect."
/>

<Interface
  required
  name="condition"
  type="(prevDeps: T | undefined, currentDeps: T) => boolean"
  description="Función que determina si el efecto debe ejecutarse según las dependencias anteriores y actuales. <br />- En el renderizado inicial, <code>prevDeps</code> será <code>undefined</code>. Tu función <code>condition</code> debe gestionar este caso. <br />- Si quieres que el efecto se ejecute en el renderizado inicial, devuelve <code>true</code> cuando <code>prevDeps</code> sea <code>undefined</code>. <br />- Si no quieres que el efecto se ejecute en el renderizado inicial, devuelve <code>false</code> cuando <code>prevDeps</code> sea <code>undefined</code>."
/>

### Valor de retorno

Esta función no devuelve ningún valor.

## Ejemplo

```tsx
import { useConditionalEffect } from 'react-simplikit';

function Component() {
  const [count, setCount] = useState(0);

  // Ejecuta el efecto solo cuando count aumenta
  useConditionalEffect(
    () => {
      console.log(`El contador aumentó a ${count}`);
    },
    [count],
    (prevDeps, currentDeps) => {
      // Ejecuta solo cuando count está definido y ha aumentado
      return prevDeps && currentDeps[0] > prevDeps[0];
    }
  );

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Incrementar: {count}
    </button>
  );
}
```
