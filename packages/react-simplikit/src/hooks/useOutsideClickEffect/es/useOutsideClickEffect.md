# useOutsideClickEffect

`useOutsideClickEffect` es un Hook de React que ejecuta un callback cuando ocurre un evento de clic fuera de los contenedores especificados.
Es útil para cerrar modales, menús desplegables, descripciones emergentes y otros componentes de la interfaz cuando haces clic fuera de ellos.

## Interfaz

```ts
function useOutsideClickEffect(
  container: HTMLElement | (HTMLElement | null)[] | null,
  callback: () => void
): void;
```

### Parámetros

<Interface
  required
  name="container"
  type="HTMLElement | (HTMLElement | null)[] | null"
  description="Un único elemento HTML, un arreglo de elementos HTML o valores <code>null</code>, o <code>null</code>. Los valores <code>null</code> del arreglo se ignoran. Si no queda ningún elemento HTML, el callback no se ejecuta."
/>

<Interface
  required
  name="callback"
  type="() => void"
  description="Una función que se ejecuta cuando haces clic fuera de los contenedores especificados."
/>

### Valor de retorno

Esta función no devuelve ningún valor.

## Ejemplo

```tsx
import { useOutsideClickEffect } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);

  useOutsideClickEffect(wrapperEl, () => {
    console.log('¡Clic fuera del contenedor!');
  });

  return <div ref={setWrapperEl}>Contenido</div>;
}
```
