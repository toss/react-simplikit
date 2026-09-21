# ImpressionArea

`ImpressionArea` es un componente que mide el tiempo durante el que un elemento DOM específico permanece visible en la pantalla
y ejecuta callbacks cuando el elemento entra en el área de visualización o sale de ella. Este componente usa el Hook `useImpressionRef`
para seguir la visibilidad del elemento.

## Interfaz

```ts
function ImpressionArea<T extends ElementType>(
  as: T = 'div',
  rootMargin?: string,
  areaThreshold?: number,
  timeThreshold?: number,
  onImpressionStart?: () => void,
  onImpressionEnd?: () => void,
  ref?: Ref<Element<T>>,
  children?: React.ReactNode,
  className?: string
): JSX.Element;
```

### Parámetros

<Interface
  name="as"
  type="T"
  description="La etiqueta HTML que quieres renderizar. El valor predeterminado es <code>div</code>."
/>

<Interface
  name="rootMargin"
  type="string"
  description="Margen para ajustar el área de detección."
/>

<Interface
  name="areaThreshold"
  type="number"
  description="Proporción mínima del elemento que debe ser visible (de 0 a 1)."
/>

<Interface
  name="timeThreshold"
  type="number"
  description="Tiempo mínimo durante el que el elemento debe ser visible (en milisegundos)."
/>

<Interface
  name="onImpressionStart"
  type="() => void"
  description="Función callback que se ejecuta cuando el elemento entra en el área visible."
/>

<Interface
  name="onImpressionEnd"
  type="() => void"
  description="Función callback que se ejecuta cuando el elemento sale del área visible."
/>

<Interface
  name="ref"
  type="Ref<Element<T>>"
  description="Referencia al elemento."
/>

<Interface
  name="children"
  type="React.ReactNode"
  description="Elementos hijos que quieres renderizar dentro del componente."
/>

<Interface
  name="className"
  type="string"
  description="Nombres de clases adicionales para aplicar estilos."
/>

### Valor de retorno

<Interface
  name=""
  type="JSX.Element"
  description="Un componente de React que sigue la visibilidad de sus elementos hijos."
/>

## Ejemplo

```tsx
function App() {
  return (
    <ImpressionArea
      onImpressionStart={() =>
        console.log('El elemento entró en el área visible')
      }
      onImpressionEnd={() => console.log('El elemento salió del área visible')}
      timeThreshold={1000}
      areaThreshold={0.5}
    >
      <div>¡Sigue mi visibilidad!</div>
    </ImpressionArea>
  );
}
```
