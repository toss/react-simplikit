# usePrevious

`usePrevious` es un Hook de React que devuelve el valor anterior del estado que le pasas.
Conserva el valor anterior sin cambios cuando hay nuevos renderizados sin cambios en el estado.
Si el estado es un objeto o necesitas personalizar la detección de cambios, puedes proporcionar una función `compare`.
De forma predeterminada, el Hook detecta los cambios de estado mediante `prev === next`.

## Interfaz

```ts
function usePrevious<T>(state: T, compare?: (prev: T, next: T) => boolean): T;
```

### Parámetros

<Interface
  required
  name="state"
  type="T"
  description="El estado cuyo valor anterior quieres obtener."
/>

<Interface
  name="compare"
  type="(prev: T, next: T) => boolean"
  description="Una función de comparación opcional para determinar si el estado ha cambiado."
/>

### Valor de retorno

<Interface name="" type="T" description="El valor anterior del estado." />

## Ejemplo

```tsx
const [count, setCount] = useState(0);
// El valor inicial de previousCount es `0`
const previousCount = usePrevious(count);
```
