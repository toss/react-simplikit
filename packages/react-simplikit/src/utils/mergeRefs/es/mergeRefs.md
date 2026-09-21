# mergeRefs

Esta función recibe varias refs (RefObject o RefCallback) y devuelve una única ref que actualiza todas las refs proporcionadas.
Es útil cuando necesitas pasar varias refs a un único elemento.
Cuando una ref de callback devuelve una función de limpieza (React 19), la ref combinada también devuelve una y ejecuta todas las funciones de limpieza al desvincularse.

## Interfaz

```ts
function mergeRefs<T>(
  ...refs: Array<RefObject<T> | RefCallback<T> | null | undefined>
): RefCallback<T>;
```

### Parámetros

<Interface
  required
  name="refs"
  type="Array<RefObject<T> | RefCallback<T> | null | undefined>"
  description="Un arreglo de refs que quieres combinar. Cada ref puede ser un RefObject o un RefCallback."
/>

### Valor de retorno

<Interface
  name=""
  type="RefCallback<T>"
  description="Un único callback de ref que actualiza todas las refs proporcionadas."
/>

## Ejemplo

```tsx
forwardRef(function Component(props, parentRef) {
  const myRef = useRef(null);

  return <div ref={mergeRefs(myRef, parentRef)} />;
});
```

```tsx
function Component(props) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node == null) {
      return;
    }

    setHeight(node.offsetHeight);
  }, []);

  return <div ref={mergeRefs(measuredRef, ref)} />;
}
```
