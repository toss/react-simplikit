# useLongPress

`useLongPress` is a React hook that detects when an element is pressed and held for a specified duration.
It listens to pointer events, so a mouse, touch, or pen press is one stream and the emulated mouse events after a tap do not start a second press.
`pointercancel` cancels the press, including when the browser takes the pointer to scroll.
A non-primary pointer and any button other than the primary button are ignored.

## Interface

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.PointerEvent<E>) => void,
  options?: UseLongPressOptions
): Object;
```

### Parameters

<Interface
  required
  name="onLongPress"
  type="(event: React.PointerEvent<E>) => void"
  description="The callback function to be executed when a long press is detected."
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="Configuration options for the long press behavior."
  :nested="[
    {
      name: 'options.delayMs',
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
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'Optional function to execute on a normal click (press and release before delay).',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description: 'Optional function to execute when a long press ends.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="Object"
  description="Event handlers to attach to an element."
  :nested="[
    {
      name: 'onPointerDown',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description: 'Starts a press for the primary pointer\'s primary button.',
    },
    {
      name: 'onPointerUp',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'Ends the tracked press. Calls <code>onClick</code> when released before the delay, or <code>onLongPressEnd</code> when a long press already fired.',
    },
    {
      name: 'onPointerLeave',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'Cancels the tracked press when the pointer leaves the element. Does not call <code>onClick</code>. Calls <code>onLongPressEnd</code> when a long press already fired.',
    },
    {
      name: 'onPointerCancel',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'Cancels the tracked press when the browser cancels the pointer, for example when scrolling starts. Does not call <code>onClick</code>. Calls <code>onLongPressEnd</code> when a long press already fired.',
    },
    {
      name: 'onPointerMove',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'Cancels a pending long press when movement exceeds <code>moveThreshold</code>. Included if <code>moveThreshold</code> is provided.',
    },
  ]"
/>

## Example

```tsx
import { useLongPress } from 'react-simplikit';

function ContextMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressHandlers = useLongPress(() => setMenuVisible(true), {
    delayMs: 400,
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
