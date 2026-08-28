# Utilidades para móvil

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
