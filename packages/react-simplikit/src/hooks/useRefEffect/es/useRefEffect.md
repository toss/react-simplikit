# useRefEffect

`useRefEffect` es un Hook de React que te ayuda a establecer una referencia a un elemento DOM específico y ejecutar un callback cada vez que cambia el elemento.
Este Hook llama a una función de limpieza cada vez que cambia el elemento para evitar fugas de memoria.

## Interfaz

```ts
function useRefEffect<RefElement extends HTMLElement = HTMLElement>(
  callback: (element: RefElement) => CleanupCallback | void,
  deps: DependencyList
): (element: RefElement | null) => void;
```

### Parámetros

<Interface
  required
  name="callback"
  type="(element: RefElement) => CleanupCallback | void"
  description="Un callback que el Hook ejecuta cuando establece el elemento. Esta función puede devolver una función de limpieza."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="Un arreglo de dependencias que define cuándo debe volver a ejecutarse el callback. El Hook vuelve a ejecutar el <code>callback</code> cada vez que cambian las <code>deps</code>."
/>

### Valor de retorno

<Interface
  name=""
  type="(element: RefElement | null) => void"
  description="Una función para establecer el elemento. Pasa esta función al atributo <code>ref</code> y el Hook llamará al <code>callback</code> cada vez que cambie el elemento."
/>

## Ejemplo

```tsx
import { useRefEffect } from 'react-simplikit';

function Component() {
  const ref = useRefEffect<HTMLDivElement>(element => {
    console.log('Elemento montado:', element);

    return () => {
      console.log('Elemento desmontado:', element);
    };
  }, []);

  return <div ref={ref}>Ejemplo básico</div>;
}
```
