# isKeyboardVisible

`isKeyboardVisible` es una función de utilidad que comprueba si el teclado en pantalla está visible en este momento.

Esta función usa `getKeyboardHeight()` internamente y devuelve `true`
si la altura del teclado es mayor que 0.

## Interfaz

```ts
function isKeyboardVisible(): boolean;
```

### Parámetros

Esta función no acepta parámetros.

### Valor de retorno

<Interface
  name=""
  type="boolean"
  description="<code>true</code> si el teclado está visible; <code>false</code> en caso contrario."
/>

## Ejemplo

```tsx
if (isKeyboardVisible()) {
  console.log('El teclado está abierto');
} else {
  console.log('El teclado está cerrado');
}
```

```tsx
// Mostrar u ocultar elementos según la visibilidad del teclado
const showFloatingButton = !isKeyboardVisible();
```
