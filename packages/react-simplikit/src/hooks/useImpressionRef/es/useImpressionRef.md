# useImpressionRef

`useImpressionRef` es un Hook de React que mide el tiempo durante el cual un elemento específico del DOM está visible en pantalla y ejecuta callbacks cuando el elemento entra en el área visible o sale de ella.
Usa `IntersectionObserver` y la `Visibility API` para hacer un seguimiento de la visibilidad del elemento.

## Interfaz

```ts
function useImpressionRef<Element extends HTMLElement>(
  options: UseImpressionRefOptions
): (element: Element | null) => void;
```

### Parámetros

<Interface
  required
  name="options"
  type="UseImpressionRefOptions"
  description="Opciones para hacer un seguimiento de la visibilidad del elemento."
  :nested="[
    {
      name: 'options.onImpressionStart',
      type: '() => void',
      required: false,
      description:
        'Callback que se ejecuta cuando el elemento entra en el área visible',
    },
    {
      name: 'options.onImpressionEnd',
      type: '() => void',
      required: false,
      description: 'Callback que se ejecuta cuando el elemento sale del área visible',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: 'Tiempo mínimo durante el cual el elemento debe estar visible (en milisegundos)',
    },
    {
      name: 'options.areaThreshold',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: 'Proporción mínima del elemento que debe estar visible (de 0 a 1)',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      required: true,
      description: 'Margen para ajustar el área de detección',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="(element: Element | null) => void"
  description="Una función para establecer el elemento. Asigna esta función al atributo <code>ref</code> y los callbacks se ejecutarán cada vez que cambie la visibilidad del elemento."
/>

## Ejemplo

```tsx
import { useImpressionRef } from 'react-simplikit';

function Component() {
  const ref = useImpressionRef<HTMLDivElement>({
    onImpressionStart: () => console.log('El elemento entró en el área visible'),
    onImpressionEnd: () => console.log('El elemento salió del área visible'),
    timeThreshold: 1000,
    areaThreshold: 0.5,
  });

  return <div ref={ref}>¡Haz un seguimiento de mi visibilidad!</div>;
}
```
