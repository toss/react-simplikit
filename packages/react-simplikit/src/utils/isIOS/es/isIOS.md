# isIOS

`isIOS` es una función de utilidad que detecta si el dispositivo actual ejecuta iOS o iPadOS.

Prioriza la API User-Agent Client Hints (`navigator.userAgentData.platform`) y, si no está disponible, recurre a las cadenas heredadas `navigator.platform` / `navigator.userAgent`.

Notas sobre las inconsistencias de la plataforma:

- Antes de iPadOS 13, los iPad indicaban “iPad” como su plataforma (o coincidían con /iPad/ en el agente de usuario).
- A partir de iPadOS 13, Apple cambió la cadena de plataforma a “MacIntel”
  para que los sitios web trataran iPadOS como Safari de escritorio.
  Sin embargo, estos dispositivos siguen exponiendo capacidades multitáctiles.
- Los navegadores basados en Chromium pueden informar el `platform` de Client Hints como `"iOS"` en lugar de `"iPhone"`.

## Interfaz

```ts
function isIOS(userAgent?: string): boolean;
```

### Parámetros

<Interface
  name="userAgent"
  type="string"
  description="Cadena opcional de agente de usuario a comprobar. Por defecto usa <code>navigator.userAgent</code>. Si se proporciona, se compara esa cadena directamente; la heurística moderna de iPadOS sigue usando la plataforma y las APIs táctiles en vivo para detectar Safari de iPad de clase escritorio."
/>

### Valor de retorno

<Interface
  name=""
  type="boolean"
  description="<code>true</code> si el dispositivo ejecuta iOS o iPadOS; <code>false</code> en caso contrario. Devuelve <code>false</code> en entornos de renderizado del lado del servidor."
/>

## Ejemplo

```tsx
if (isIOS()) {
  // Código específico de iOS
  enableIOSOptimizations();
}
```

```tsx
// Con un agente de usuario personalizado
const isIOSDevice = isIOS(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
);
```
