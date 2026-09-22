# mergeProps

`mergeProps` es una función de utilidad que combina varios objetos de props en un único objeto.
Gestiona la combinación de las propiedades `className`, `style` y de tipo `function`.

## Interfaz

```ts
function mergeProps<PropsList>(
  ...props: PropsList
): TupleToIntersection<PropsList>;
```

### Parámetros

<Interface
  required
  name="props"
  type="PropsList"
  description="Los objetos de props que quieres combinar."
/>

### Valor de retorno

<Interface
  name=""
  type="TupleToIntersection<PropsList>"
  description="El objeto con las props combinadas."
/>

## Ejemplo

```tsx
const mergedProps = mergeProps(
  { className: 'foo', style: { color: 'red' } },
  { className: 'bar', style: { backgroundColor: 'blue' } }
);
console.log(mergedProps); // { className: 'foo bar', style: { color: 'red', backgroundColor: 'blue' } }
```
