# useLongPress

`useLongPress` es un Hook de React que detecta cuando mantienes presionado un elemento durante un tiempo especificado.
El Hook escucha eventos de puntero, así que una pulsación de ratón, táctil o de lápiz es un solo flujo y los eventos de ratón emulados que siguen a un toque no inician una segunda pulsación.
`pointercancel` cancela la pulsación, también cuando el navegador toma el puntero para desplazarse.
El Hook ignora un puntero que no es el principal y cualquier botón que no sea el botón principal.

## Interfaz

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.PointerEvent<E>) => void,
  options?: UseLongPressOptions
): Object;
```

### Parámetros

<Interface
  required
  name="onLongPress"
  type="(event: React.PointerEvent<E>) => void"
  description="El callback que se ejecuta al detectar una pulsación prolongada."
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="Opciones de configuración del comportamiento de la pulsación prolongada."
  :nested="[
    {
      name: 'options.delayMs',
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
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'Función opcional que se ejecuta al hacer un clic normal (presionar y soltar antes de que transcurra el tiempo de espera).',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event: React.PointerEvent<E>) => void',
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
      name: 'onPointerDown',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description: 'Inicia una pulsación con el botón principal del puntero principal.',
    },
    {
      name: 'onPointerUp',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'Termina la pulsación en curso. Llama a <code>onClick</code> si la sueltas antes del tiempo de espera, o a <code>onLongPressEnd</code> si la pulsación prolongada ya se activó.',
    },
    {
      name: 'onPointerLeave',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'Cancela la pulsación en curso cuando el puntero sale del elemento. No llama a <code>onClick</code>. Llama a <code>onLongPressEnd</code> si la pulsación prolongada ya se activó.',
    },
    {
      name: 'onPointerCancel',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'Cancela la pulsación en curso cuando el navegador cancela el puntero, por ejemplo cuando empieza el desplazamiento. No llama a <code>onClick</code>. Llama a <code>onLongPressEnd</code> si la pulsación prolongada ya se activó.',
    },
    {
      name: 'onPointerMove',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'Cancela una pulsación prolongada pendiente cuando el movimiento supera <code>moveThreshold</code>. Está incluido si proporcionas <code>moveThreshold</code>.',
    },
  ]"
/>

## Ejemplo

```tsx
import { useLongPress } from 'react-simplikit';

function ContextMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressHandlers = useLongPress(() => setMenuVisible(true), {
    delayMs: 400,
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
