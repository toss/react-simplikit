# isServer

`isServer` es una función de utilidad que comprueba si el código está ejecutándose en el servidor.
Devuelve `true` en entornos de SSR (renderizado en el servidor) donde `window` no está definido,
y `false` en entornos del lado del cliente.

## Interfaz

```ts
function isServer(): boolean;
```

### Parámetros

Esta función no acepta parámetros.

### Valor de retorno

<Interface
  name=""
  type="boolean"
  description="<code>true</code> si el código está ejecutándose en un entorno de servidor (SSR); <code>false</code> en caso contrario."
/>

## Ejemplo

```tsx
if (isServer()) {
  // Código seguro para SSR
  return null;
}

// Código exclusivo del cliente
window.addEventListener('resize', handleResize);
```
