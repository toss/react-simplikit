# isAndroid

`isAndroid` es una función de utilidad que detecta si el dispositivo actual usa Android.

Notas:

- Todos los navegadores de Android incluyen el token “Android” en el agente de usuario.

## Interfaz

```ts
function isAndroid(userAgent?: string): boolean;
```

### Parámetros

<Interface
  name="userAgent"
  type="string"
  description="Cadena opcional del agente de usuario que quieres comprobar. El valor predeterminado es <code>navigator.userAgent</code>."
/>

### Valor de retorno

<Interface
  name=""
  type="boolean"
  description="<code>true</code> si el dispositivo usa Android; <code>false</code> en caso contrario. Devuelve <code>false</code> en entornos de renderizado en el servidor."
/>

## Ejemplo

```tsx
if (isAndroid()) {
  // Código específico de Android
  enableAndroidOptimizations();
}
```

```tsx
// Con un agente de usuario personalizado
const isAndroidDevice = isAndroid(
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120'
);
```
