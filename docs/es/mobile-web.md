# Web móvil

Una colección de Hooks de React que resuelven los retos de interfaz más habituales en entornos de web móvil.

## ¿Por qué utilidades para móvil?

El desarrollo web para móvil trae consigo retos propios que no existen en escritorio:

- **Evitar el teclado**: los elementos fijados abajo quedan ocultos cuando aparece el teclado en pantalla
- **Detección de la dirección del desplazamiento**: cabeceras y barras de navegación que se muestran u ocultan según el desplazamiento
- **Supervisión del estado de la red**: adaptar la calidad del contenido a la velocidad de la conexión
- **Seguimiento de la visibilidad de la página**: pausar los videos o la analítica cuando la aplicación pasa a segundo plano
- **Cambios en el viewport visual**: gestionar el zoom, el teclado y el redimensionado del viewport en los navegadores móviles

`react-simplikit` ofrece Hooks para móvil probados en producción que resuelven estos escenarios con una configuración mínima.

## Inicio rápido

```bash
npm install react-simplikit
```

### Ejemplo de botón CTA

El patrón de interfaz móvil más habitual: un botón fijado abajo que se mueve por encima del teclado.

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

function FixedBottomCTA() {
  const { style } = useAvoidKeyboard();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

### Ejemplo de campo de chat

Una interfaz de chat con un campo de entrada que se mantiene por encima del teclado.

```tsx
import { useState } from 'react';
import { useAvoidKeyboard } from 'react-simplikit';

function ChatInput() {
  const { style } = useAvoidKeyboard();
  const [message, setMessage] = useState('');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        gap: '8px',
        padding: '12px',
        ...style,
      }}
    >
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1 }}
      />
      <button>Send</button>
    </div>
  );
}
```

### Con área segura

En los dispositivos con indicador de inicio (como el iPhone), puedes añadir un margen para el área segura.

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

function FixedBottomCTA() {
  const { style } = useAvoidKeyboard({ safeAreaBottom: 34 });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

## Hooks disponibles

| Hook                                               | Descripción                                                       |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| [useAvoidKeyboard](/es/hooks/useAvoidKeyboard)     | Mueve los elementos fijos por encima del teclado en pantalla      |
| [useKeyboardHeight](/es/hooks/useKeyboardHeight)   | Devuelve la altura actual del teclado                             |
| [useBodyScrollLock](/es/hooks/useBodyScrollLock)   | Bloquea el desplazamiento del body para modales y superposiciones |
| [useScrollDirection](/es/hooks/useScrollDirection) | Detecta la dirección del desplazamiento (arriba/abajo)            |
| [useNetworkStatus](/es/hooks/useNetworkStatus)     | Supervisa el estado de la conexión de red                         |
| [usePageVisibility](/es/hooks/usePageVisibility)   | Sigue el estado de visibilidad de la página                       |
| [useVisualViewport](/es/hooks/useVisualViewport)   | Proporciona las dimensiones y la posición del viewport visual     |

## Hoja de ruta {#roadmap}

Las pantallas de los móviles son pequeñas, y ese espacio reducido genera una cantidad sorprendente de retos de interfaz. Los elementos quedan ocultos tras el teclado en pantalla, las áreas seguras varían según el dispositivo y el viewport que el usuario ve de verdad suele diferir del que informa el navegador. No son casos límite: son la realidad diaria del desarrollo para móvil.

### El problema: una interfaz poco fiable en las pantallas de los móviles

En los dispositivos móviles, lo que los usuarios ven en su pantalla no siempre coincide con lo que esperan los desarrolladores. Estos son algunos escenarios habituales:

- **El teclado tapa los campos de entrada**: cuando el usuario toca un campo de texto, el teclado en pantalla sube y puede ocultar por completo el campo o el botón de envío fijado abajo.
- **Inconsistencias en las áreas seguras**: los dispositivos con muescas, esquinas redondeadas o indicadores de inicio (como la barra inferior del iPhone) tienen zonas reservadas donde no debe colocarse contenido, pero esas zonas varían entre dispositivos y versiones del sistema operativo.
- **Confusión con el viewport**: el viewport de diseño del navegador y el área visible real (el viewport visual) pueden diferir bastante, sobre todo cuando el teclado está abierto o la página tiene zoom aplicado. Los elementos de posición fija pueden acabar en lugares inesperados.

Estos problemas no son exclusivos de un sistema operativo ni de un dispositivo concreto. Ya sea iOS Safari, Android Chrome o cualquier otro navegador móvil, el reto de fondo es el mismo: **el área visible es impredecible y el CSS estándar por sí solo no puede tenerla en cuenta de forma fiable**.

### Nuestro enfoque: centrarnos en el viewport visual

Las utilidades para móvil de `react-simplikit` abordan estos problemas con un enfoque muy concreto. En lugar de sortear las rarezas de cada navegador con trucos frágiles, centramos el diseño en el **viewport visual**: el área de la pantalla que el usuario puede ver realmente en cada momento.

Al apoyarnos en la [Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API), ofrecemos Hooks que te permiten:

- **Detectar la aparición del teclado y reaccionar a ella** para que los elementos fijados abajo se aparten con naturalidad.
- **Leer los márgenes del área segura** para tener en cuenta correctamente las muescas, los indicadores de inicio y otras zonas reservadas propias de cada dispositivo.
- **Seguir el área visible real** para que tus decisiones de maquetación se basen en lo que el usuario ve de verdad y no en lo que supone el motor de maquetación del navegador.

El objetivo es sencillo: **dentro del viewport visual, la interfaz debe renderizarse de forma fiable y predecible**.

### Multiplataforma y multidispositivo

No queremos limitarnos a un sistema operativo ni a un modelo de dispositivo concreto. La web móvil es multiplataforma por naturaleza, y `react-simplikit` lo asume como punto de partida.

Nuestros Hooks están diseñados para funcionar de forma consistente en:

- **iOS y Android**: las dos plataformas móviles dominantes.
- **Distintos navegadores**: Safari, Chrome, Samsung Internet y más.
- **Distintos formatos de dispositivo**: desde teléfonos compactos hasta dispositivos de pantalla grande, con o sin muescas e indicadores de inicio.

Cuando una API concreta no está disponible (por ejemplo, `window.visualViewport` en navegadores antiguos), ofrecemos alternativas seguras que degradan el comportamiento con elegancia sin romper tu interfaz.

### Próximos pasos

Seguimos ampliando el conjunto de Hooks para móvil disponibles en `react-simplikit`, siempre guiados por el mismo principio: **hacer que el desarrollo de interfaces móviles sea predecible y fiable, sea cual sea el dispositivo o el sistema operativo**. Si existe un problema habitual de interfaz en móvil, lo más probable es que estemos trabajando en una solución limpia y declarativa para él.

## Principios específicos para móvil {#mobile-specific-principles}

### Diseño consciente de la plataforma

En nuestras implementaciones tenemos en cuenta las diferencias de comportamiento entre iOS y Android:

- **Diferencias en la Visual Viewport API**:
  - iOS: `offsetTop` se vuelve negativo cuando aparece el teclado
  - Android: `offsetTop` suele mantenerse en 0
- **Cálculo de la altura del teclado**: tratamiento específico por plataforma para obtener medidas precisas

### La seguridad en SSR es lo primero

Cada Hook incluye pruebas de SSR para garantizar un renderizado en el servidor seguro:

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

### Optimización del rendimiento

Los entornos móviles exigen una atención especial al rendimiento:

- **Throttling y debouncing de eventos**: optimiza los eventos frecuentes como el desplazamiento y el redimensionado
- **Detectores de eventos pasivos**: usa detectores pasivos cuando sea aplicable
- **Transiciones de React**: aprovecha `startTransition` para las actualizaciones no urgentes

## Directrices específicas para móvil {#mobile-specific-guidelines}

### Probar en dispositivos reales

- Se recomienda probar en iOS Safari y Android Chrome
- El comportamiento de la Visual Viewport API debe verificarse en dispositivos reales

### Diferencias entre plataformas

Ten en cuenta estas diferencias entre plataformas al implementar:

| Característica             | iOS                                          | Android                     |
| -------------------------- | -------------------------------------------- | --------------------------- |
| `visualViewport.offsetTop` | Se vuelve negativo cuando aparece el teclado | Suele mantenerse en 0       |
| Comportamiento del teclado | El viewport se desplaza hacia arriba         | Redimensiona la maquetación |

### Patrón de acceso a window/document

Usa siempre el patrón seguro para SSR cuando accedas a las APIs del navegador:

```typescript
// ✅ Patrón seguro para SSR
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;

// Ahora es seguro usar window/document
window.visualViewport?.addEventListener('resize', handler);
```

## Estándares de diseño de la API

### Valores de retorno de los Hooks

Seguimos patrones consistentes para los valores de retorno de los Hooks:

- **Objeto**: para el estado y los valores relacionados (por ejemplo, `useKeyboardHeight(): { keyboardHeight }`, `useVisualViewport(): { viewport }`)
- **void**: para los Hooks que solo producen efectos secundarios (por ejemplo, `useBodyScrollLock(): void`)

### Parámetros

- Los parámetros obligatorios van primero y los opcionales al final
- Usa un objeto de opciones cuando haya 3 o más parámetros opcionales

### Patrón de seguridad para SSR

Todos los Hooks siguen el patrón seguro para SSR:

```typescript
// ✅ Seguro para SSR: todos los Hooks siguen este patrón
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;
```
