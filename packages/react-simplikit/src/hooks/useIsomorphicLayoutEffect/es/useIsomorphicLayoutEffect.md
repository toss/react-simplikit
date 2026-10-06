# useIsomorphicLayoutEffect

`useIsomorphicLayoutEffect` es un Hook de React que ejecuta `useLayoutEffect` en el navegador sin generar su advertencia durante el renderizado en el servidor.
Durante el SSR, no hay un DOM que puedas medir o modificar de forma síncrona, por lo que React advierte sobre el uso de `useLayoutEffect`.

React no ejecuta efectos en el servidor, así que el efecto solo se ejecuta en el navegador. En el servidor, este Hook es `useEffect`, que React omite.
Solo existe para evitar la advertencia: no ejecuta nada en el servidor ni hace que la salida del servidor coincida con la del cliente.

En el navegador, se ejecuta de forma síncrona después de las actualizaciones del DOM, pero antes de que el navegador pinte la pantalla, lo que lo hace ideal para:

- Medir elementos del DOM después del renderizado
- Aplicar cambios al DOM antes de que el navegador pinte la pantalla
- Evitar parpadeos en la interfaz o cambios en la disposición de los elementos

## Interfaz

```ts
function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void;
```

### Parámetros

<Interface
  required
  name="effect"
  type="React.EffectCallback"
  description="La función del efecto."
/>

<Interface
  name="deps"
  type="React.DependencyList"
  description="Un arreglo opcional de dependencias."
/>

### Valor de retorno

Esta función no devuelve ningún valor.

## Ejemplo

```tsx
useIsomorphicLayoutEffect(() => {
  // Código que se ejecuta durante la fase de disposición de los elementos en el cliente
}, [dep1, dep2, ...]);
```
