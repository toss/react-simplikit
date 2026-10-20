# isAndroid

`isAndroid` es una función de utilidad que detecta si el dispositivo actual usa Android.

Prioriza la API User-Agent Client Hints (`navigator.userAgentData.platform`) y, si no está disponible, busca `"Android"` en las marcas de Client Hints o en `navigator.userAgent`.

Notas:

- Todos los navegadores de Android incluyen el token “Android” en el agente de usuario.
- Chromium en Android suele exponer el `platform` de Client Hints como `"Android"`.

## Interfaz

```ts
function isAndroid(userAgent?: string): boolean;
```

### Parámetros

<Interface
  name="userAgent"
  type="string"
  description="Cadena opcional de agente de usuario a comprobar. Por defecto usa <code>navigator.userAgent</code>."
/>

### Valor de retorno

<Interface
  name=""
  type="boolean"
  description="<code>true</code> si el dispositivo usa Android; <code>false</code> en caso contrario. Devuelve <code>false</code> en entornos de renderizado del lado del servidor."
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
