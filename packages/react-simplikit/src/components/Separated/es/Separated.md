# Separated

`Separated` es un componente que inserta el componente que especificas entre cada par de elementos hijos consecutivos.
Te resulta útil para añadir separadores, espacios u otros elementos repetidos en listas.

## Interfaz

```ts
function Separated(children: React.ReactNode, by: React.ReactNode): JSX.Element;
```

### Parámetros

<Interface
  required
  name="children"
  type="React.ReactNode"
  description="Los elementos hijos que quieres renderizar. Solo se renderizan los elementos de React válidos (<code>React.isValidElement</code>)."
/>

<Interface
  required
  name="by"
  type="React.ReactNode"
  description="El componente que quieres insertar entre los elementos hijos."
/>

### Valor de retorno

<Interface
  name=""
  type="JSX.Element"
  description="Un componente de React que separa los elementos hijos con el separador que especificas."
/>

## Ejemplo

```tsx
function App() {
  return (
    <Separated by={<Border type="padding24" />}>
      {['hola', 'react', 'mundo'].map(item => (
        <div key={item}>{item}</div>
      ))}
    </Separated>
  );
  // Resultado esperado:
  // <div>hola</div>
  // <Border type="padding24" />
  // <div>react</div>
  // <Border type="padding24" />
  // <div>mundo</div>
}
```
