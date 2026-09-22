# useLongPress

`useLongPress` es un Hook de React que detecta cuando mantienes presionado un elemento durante un tiempo especificado.
Gestiona tanto eventos del ratón como eventos táctiles, lo que permite un funcionamiento uniforme en computadoras y dispositivos móviles.

## Interfaz

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.MouseEvent<E> | React.TouchEvent<E>) => void,
  options?: UseLongPressOptions
): Object;
```

### Parámetros

<Interface
  required
  name="onLongPress"
  type="(event: React.MouseEvent<E> | React.TouchEvent<E>) => void"
  description="El callback que se ejecuta al detectar una pulsación prolongada."
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="Opciones de configuración del comportamiento de la pulsación prolongada."
  :nested="[
    {
      name: 'options.delay',
      type: 'number',
      required: false,
      defaultValue: '500',
      description:
        'El tiempo en milisegundos antes de activar la pulsación prolongada. El valor predeterminado es 500 ms.',
    },
    {
      name: 'options.moveThreshold',
      type: 'Object',
      required: false,
      description: 'Movimiento máximo permitido antes de cancelar una pulsación prolongada.',
    },
    {
      name: 'options.moveThreshold.x',
      type: 'number',
      required: false,
      description: 'Movimiento horizontal máximo en píxeles.',
    },
    {
      name: 'options.moveThreshold.y',
      type: 'number',
      required: false,
      description: 'Movimiento vertical máximo en píxeles.',
    },
    {
      name: 'options.onClick',
      type: '(event) => void',
      required: false,
      description:
        'Función opcional que se ejecuta al hacer un clic normal (presionar y soltar antes de que transcurra el tiempo de espera).',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event) => void',
      required: false,
      description: 'Función opcional que se ejecuta cuando termina una pulsación prolongada.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="Object"
  description="Controladores de eventos para asignar a un elemento."
  :nested="[
    {
      name: 'onMouseDown',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: 'Controlador de eventos de presión del botón del ratón.',
    },
    {
      name: 'onMouseUp',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: 'Controlador de eventos de liberación del botón del ratón.',
    },
    {
      name: 'onMouseLeave',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: 'Controlador de eventos de salida del puntero del ratón del elemento.',
    },
    {
      name: 'onTouchStart',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: 'Controlador de eventos de inicio del contacto táctil.',
    },
    {
      name: 'onTouchEnd',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: 'Controlador de eventos de finalización del contacto táctil.',
    },
    {
      name: 'onMouseMove',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description:
        'Controlador de eventos de movimiento del ratón. Está incluido si proporcionas <code>moveThreshold</code>.',
    },
    {
      name: 'onTouchMove',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description:
        'Controlador de eventos de movimiento táctil. Está incluido si proporcionas <code>moveThreshold</code>.',
    },
  ]"
/>

## Ejemplo

```tsx
import { useLongPress } from 'react-simplikit';

function ContextMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressHandlers = useLongPress(() => setMenuVisible(true), {
    delay: 400,
    onClick: () => console.log('Clic normal'),
    onLongPressEnd: () => console.log('Pulsación prolongada completada'),
  });

  return (
    <div>
      <button {...longPressHandlers}>Mantén presionado</button>
      {menuVisible && <div className="context-menu">Menú contextual</div>}
    </div>
  );
}
```
