# useIntersectionObserver

`useIntersectionObserver` es un Hook de React que detecta si un elemento específico del DOM es visible en la pantalla.
Usa la API `IntersectionObserver` para ejecutar un callback cuando el elemento entra en el área visible o sale de ella.

## Interfaz

```ts
function useIntersectionObserver<Element extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
): (element: Element | null) => void;
```

### Parámetros

<Interface
  required
  name="callback"
  type="(entry: IntersectionObserverEntry) => void"
  description="Un callback que se ejecuta cuando cambia la visibilidad del elemento. Puedes consultar <code>entry.isIntersecting</code> para determinar si el elemento está dentro del área visible."
/>

<Interface
  required
  name="options"
  type="IntersectionObserverInit"
  description="Opciones de <code>IntersectionObserver</code>."
  :nested="[
    {
      name: 'options.root',
      type: 'Element | Document | null',
      required: false,
      description:
        'El elemento que define el área visible para comprobar la visibilidad del elemento objetivo.',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      required: false,
      description: 'Margen alrededor del elemento raíz.',
    },
    {
      name: 'options.threshold',
      type: 'number | number[]',
      required: false,
      description:
        'Un número o un arreglo de números que indican el porcentaje de visibilidad del elemento objetivo en el que debe ejecutarse el callback del observador.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="(element: Element | null) => void"
  description="Una función para establecer el elemento. Asigna esta función al atributo <code>ref</code> para que el <code>callback</code> se ejecute cada vez que cambie la visibilidad del elemento."
/>

## Ejemplo

```tsx
import { useIntersectionObserver } from 'react-simplikit';

function Component() {
  const ref = useIntersectionObserver<HTMLDivElement>(
    entry => {
      if (entry.isIntersecting) {
        console.log('El elemento está dentro del área visible:', entry.target);
      } else {
        console.log('El elemento está fuera del área visible:', entry.target);
      }
    },
    { threshold: 0.5 }
  );

  return <div ref={ref}>¡Obsérvame!</div>;
}
```
