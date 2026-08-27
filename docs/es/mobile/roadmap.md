# Hoja de ruta

Las pantallas de los móviles son pequeñas, y ese espacio reducido genera una cantidad sorprendente de retos de interfaz. Los elementos quedan ocultos tras el teclado en pantalla, las áreas seguras varían según el dispositivo y el viewport que el usuario ve de verdad suele diferir del que informa el navegador. No son casos límite: son la realidad diaria del desarrollo para móvil.

## El problema: una interfaz poco fiable en las pantallas de los móviles

En los dispositivos móviles, lo que los usuarios ven en su pantalla no siempre coincide con lo que esperan los desarrolladores. Estos son algunos escenarios habituales:

- **El teclado tapa los campos de entrada**: cuando el usuario toca un campo de texto, el teclado en pantalla sube y puede ocultar por completo el campo o el botón de envío fijado abajo.
- **Inconsistencias en las áreas seguras**: los dispositivos con muescas, esquinas redondeadas o indicadores de inicio (como la barra inferior del iPhone) tienen zonas reservadas donde no debe colocarse contenido, pero esas zonas varían entre dispositivos y versiones del sistema operativo.
- **Confusión con el viewport**: el viewport de diseño del navegador y el área visible real (el viewport visual) pueden diferir bastante, sobre todo cuando el teclado está abierto o la página tiene zoom aplicado. Los elementos de posición fija pueden acabar en lugares inesperados.

Estos problemas no son exclusivos de un sistema operativo ni de un dispositivo concreto. Ya sea iOS Safari, Android Chrome o cualquier otro navegador móvil, el reto de fondo es el mismo: **el área visible es impredecible y el CSS estándar por sí solo no puede tenerla en cuenta de forma fiable**.

## Nuestro enfoque: centrarnos en el viewport visual

Las utilidades para móvil de `react-simplikit` abordan estos problemas con un enfoque muy concreto. En lugar de sortear las rarezas de cada navegador con trucos frágiles, centramos el diseño en el **viewport visual**: el área de la pantalla que el usuario puede ver realmente en cada momento.

Al apoyarnos en la [Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API), ofrecemos Hooks que te permiten:

- **Detectar la aparición del teclado y reaccionar a ella** para que los elementos fijados abajo se aparten con naturalidad.
- **Leer los márgenes del área segura** para tener en cuenta correctamente las muescas, los indicadores de inicio y otras zonas reservadas propias de cada dispositivo.
- **Seguir el área visible real** para que tus decisiones de maquetación se basen en lo que el usuario ve de verdad y no en lo que supone el motor de maquetación del navegador.

El objetivo es sencillo: **dentro del viewport visual, la interfaz debe renderizarse de forma fiable y predecible**.

## Multiplataforma y multidispositivo

No queremos limitarnos a un sistema operativo ni a un modelo de dispositivo concreto. La web móvil es multiplataforma por naturaleza, y `react-simplikit` lo asume como punto de partida.

Nuestros Hooks están diseñados para funcionar de forma consistente en:

- **iOS y Android**: las dos plataformas móviles dominantes.
- **Distintos navegadores**: Safari, Chrome, Samsung Internet y más.
- **Distintos formatos de dispositivo**: desde teléfonos compactos hasta dispositivos de pantalla grande, con o sin muescas e indicadores de inicio.

Cuando una API concreta no está disponible (por ejemplo, `window.visualViewport` en navegadores antiguos), ofrecemos alternativas seguras que degradan el comportamiento con elegancia sin romper tu interfaz.

## Próximos pasos

Seguimos ampliando el conjunto de Hooks para móvil disponibles en `react-simplikit`, siempre guiados por el mismo principio: **hacer que el desarrollo de interfaces móviles sea predecible y fiable, sea cual sea el dispositivo o el sistema operativo**. Si existe un problema habitual de interfaz en móvil, lo más probable es que estemos trabajando en una solución limpia y declarativa para él.
