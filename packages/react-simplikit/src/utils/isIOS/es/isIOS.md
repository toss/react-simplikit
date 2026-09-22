# isIOS

`isIOS` es una función de utilidad que detecta si el dispositivo actual ejecuta iOS o iPadOS.

Notas sobre las inconsistencias de la plataforma:

- Antes de iPadOS 13, los iPad indicaban “iPad” como su plataforma (o coincidían con /iPad/ en el agente de usuario).
- A partir de iPadOS 13, Apple cambió la cadena de plataforma a “MacIntel”
  para que los sitios web trataran iPadOS como Safari de escritorio.
  Sin embargo, estos dispositivos siguen exponiendo capacidades multitáctiles.

## Interfaz

```ts
function isIOS(userAgent?: string): boolean;
```

### Parámetros

<Interface
  name="userAgent"
  type="string"
  description="Cadena de agente de usuario opcional que quieres comprobar. Su valor predeterminado es <code>navigator.userAgent</code>."
/>

### Valor de retorno

<Interface
  name=""
  type="boolean"
  description="<code>true</code> si el dispositivo ejecuta iOS o iPadOS; <code>false</code> en caso contrario. Devuelve <code>false</code> en entornos de renderizado en el servidor."
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
