# useLongPress

`useLongPress` is a React hook that detects when an element is pressed and held for a specified duration. It handles both mouse and touch events, making it work consistently across desktop and mobile devices.

## Interface

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.MouseEvent<E> | React.TouchEvent<E>) => void,
  options: UseLongPressOptions
): Object;
```

### Parameters

<Interface
  required
  name="onLongPress"
  type="(event: React.MouseEvent<E> | React.TouchEvent<E>) => void"
  description="The callback function to be executed when a long press is detected."
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="Configuration options for the long press behavior."
  :nested="[
    {
      name: 'options.delay',
      type: 'number',
      required: false,
      defaultValue: '500',
      description:
        'The time in milliseconds before triggering the long press. Defaults to 500ms.',
    },
    {
      name: 'options.moveThreshold',
      type: 'Object',
      required: false,
      description: 'Maximum movement allowed before canceling a long press.',
    },
    {
      name: 'options.moveThreshold.x',
      type: 'number',
      required: false,
      description: 'Maximum horizontal movement in pixels.',
    },
    {
      name: 'options.moveThreshold.y',
      type: 'number',
      required: false,
      description: 'Maximum vertical movement in pixels.',
    },
    {
      name: 'options.onClick',
      type: '(event) => void',
      required: false,
      description:
        'Optional function to execute on a normal click (press and release before delay).',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event) => void',
      required: false,
      description: 'Optional function to execute when a long press ends.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="Object"
  description="handlers to attach to an element."
  :nested="[
    {
      name: 'onMouseDown',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description:
        'Event handler for mouse down events. - onMouseUp <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - Event handler for mouse up events. - onMouseLeave <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - Event handler for mouse leave events. - onTouchStart <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - Event handler for touch start events. - onTouchEnd <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - Event handler for touch end events. - onMouseMove <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - Event handler for mouse move events. Included if <code>moveThreshold</code> is provided. - onTouchMove <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - Event handler for touch move events. Included if <code>moveThreshold</code> is provided..',
    },
  ]"
/>

## Example

```tsx
import { useLongPress } from 'react-simplikit';

function ContextMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressHandlers = useLongPress(() => setMenuVisible(true), {
    delay: 400,
    onClick: () => console.log('Normal click'),
    onLongPressEnd: () => console.log('Long press completed'),
  });

  return (
    <div>
      <button {...longPressHandlers}>Press and hold</button>
      {menuVisible && <div className="context-menu">Context Menu</div>}
    </div>
  );
}
```
