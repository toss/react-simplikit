# Web móvil

Una colección de Hooks de React que resuelven los retos de interfaz más habituales en entornos de web móvil.

## ¿Por qué estos Hooks?

El desarrollo web para móvil trae consigo retos que no existen en escritorio. Cada uno de ellos tiene un Hook en `react-simplikit`:

| Problema                                                                            | Qué usar                                                                                           |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Un elemento fijado abajo queda oculto tras el teclado en pantalla                   | [useAvoidKeyboard](/es/hooks/useAvoidKeyboard)                                                     |
| Leer la altura del teclado o si está visible                                        | [useKeyboardHeight](/es/hooks/useKeyboardHeight), [isKeyboardVisible](/es/utils/isKeyboardVisible) |
| Bloquear el desplazamiento del body mientras hay un bottom sheet o un modal abierto | [useBodyScrollLock](/es/hooks/useBodyScrollLock)                                                   |
| Respetar la muesca y el indicador de inicio                                         | [useSafeAreaInset](/es/hooks/useSafeAreaInset), [getSafeAreaInset](/es/utils/getSafeAreaInset)     |
| Seguir el área que el usuario ve realmente                                          | [useVisualViewport](/es/hooks/useVisualViewport)                                                   |
| Mostrar u ocultar una cabecera según la dirección del desplazamiento                | [useScrollDirection](/es/hooks/useScrollDirection)                                                 |
| Adaptar el contenido a la conexión de red                                           | [useNetworkStatus](/es/hooks/useNetworkStatus)                                                     |
| Pausar el trabajo cuando la página pasa a segundo plano                             | [usePageVisibility](/es/hooks/usePageVisibility)                                                   |
| Distinguir la plataforma                                                            | [isIOS](/es/utils/isIOS), [isAndroid](/es/utils/isAndroid)                                         |

Cada entrada es una importación con nombre desde `react-simplikit`, y la [referencia](/es/reference) las lista junto con todo lo demás.

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

## Hoja de ruta {#roadmap}

Las pantallas de los móviles son pequeñas, y ese espacio reducido genera una cantidad sorprendente de retos de interfaz. Los elementos quedan ocultos tras el teclado en pantalla, las áreas seguras varían según el dispositivo y el viewport que el usuario ve de verdad suele diferir del que informa el navegador. No son casos límite: son la realidad diaria del desarrollo para móvil.

### El problema: una interfaz poco fiable en las pantallas de los móviles

En los dispositivos móviles, lo que los usuarios ven en su pantalla no siempre coincide con lo que esperan los desarrolladores. Estos son algunos escenarios habituales:

- **El teclado tapa los campos de entrada**: cuando el usuario toca un campo de texto, el teclado en pantalla sube y puede ocultar por completo el campo o el botón de envío fijado abajo.
- **Inconsistencias en las áreas seguras**: los dispositivos con muescas, esquinas redondeadas o indicadores de inicio (como la barra inferior del iPhone) tienen zonas reservadas donde no debe colocarse contenido, pero esas zonas varían entre dispositivos y versiones del sistema operativo.
- **Confusión con el viewport**: el viewport de diseño del navegador y el área visible real (el viewport visual) pueden diferir bastante, sobre todo cuando el teclado está abierto o la página tiene zoom aplicado. Los elementos de posición fija pueden acabar en lugares inesperados.

Estos problemas no son exclusivos de un sistema operativo ni de un dispositivo concreto. Ya sea iOS Safari, Android Chrome o cualquier otro navegador móvil, el reto de fondo es el mismo: **el área visible es impredecible y el CSS estándar por sí solo no puede tenerla en cuenta de forma fiable**.

### Nuestro enfoque: centrarnos en el viewport visual

En lugar de sortear las rarezas de cada navegador con trucos frágiles, estos Hooks se centran en el **viewport visual**: el área de la pantalla que el usuario puede ver realmente en cada momento.

Construidos sobre la [Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API), te permiten:

- **Detectar la aparición del teclado y reaccionar a ella** para que los elementos fijados abajo se aparten con naturalidad.
- **Leer los márgenes del área segura** para tener en cuenta correctamente las muescas, los indicadores de inicio y otras zonas reservadas propias de cada dispositivo.
- **Seguir el área visible real** para que tus decisiones de maquetación se basen en lo que el usuario ve de verdad y no en lo que supone el motor de maquetación del navegador.

El objetivo es sencillo: **dentro del viewport visual, la interfaz debe renderizarse de forma fiable y predecible**.

### Multiplataforma y multidispositivo

La web móvil es multiplataforma por naturaleza, y estos Hooks también lo son. Están diseñados para funcionar de forma consistente en:

- **iOS y Android**: las dos plataformas móviles dominantes. Donde difieren (iOS informa de un `visualViewport.offsetTop` negativo mientras el teclado está abierto; Android lo mantiene en 0 y redimensiona la maquetación), los Hooks absorben la diferencia para que no tengas que hacerlo tú.
- **Distintos navegadores**: Safari, Chrome, Samsung Internet y más.
- **Distintos formatos de dispositivo**: desde teléfonos compactos hasta dispositivos de pantalla grande, con o sin muescas e indicadores de inicio.

Cuando una API concreta no está disponible (por ejemplo, `window.visualViewport` en navegadores antiguos), ofrecemos alternativas seguras que degradan el comportamiento con elegancia sin romper tu interfaz.

### Próximos pasos

Seguimos añadiendo Hooks para los problemas de interfaz de la web móvil, siempre guiados por el mismo principio: **hacer que el desarrollo de interfaces móviles sea predecible y fiable, sea cual sea el dispositivo o el sistema operativo**. Si existe un problema habitual de interfaz en móvil, lo más probable es que estemos trabajando en una solución limpia y declarativa para él.
