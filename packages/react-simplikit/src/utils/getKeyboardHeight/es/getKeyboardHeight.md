# getKeyboardHeight

`getKeyboardHeight` es una función de utilidad que devuelve la altura actual del teclado en pantalla en píxeles.

Esta función usa la API Visual Viewport para calcular la altura del teclado.
Presupone un entorno moderno compatible con Visual Viewport
(Safari / WKWebView 14+, Chrome / Android WebView 80+).

La altura del teclado corresponde al resultado de este cálculo:
`window.innerHeight - visualViewport.height - visualViewport.offsetTop`

La resta de `offsetTop` es necesaria para manejar correctamente el comportamiento de iOS,
donde el área visible de la página puede desplazarse verticalmente cuando aparece el teclado.

## Interfaz

```ts
function getKeyboardHeight(): number;
```

### Parámetros

Esta función no acepta ningún parámetro.

### Valor de retorno

<Interface
  name=""
  type="number"
  description="La altura del teclado en píxeles. Devuelve 0 si el teclado no está visible."
/>

## Ejemplo

```tsx
const height = getKeyboardHeight();

if (height > 0) {
  footer.style.paddingBottom = `${height}px`;
}
```
