# useDoubleClick

`useDoubleClick` is a React hook that differentiates between single and double click events.
For pointer clicks, it delays the single click callback execution for a specified time, and cancels it if a second click (i.e. a double click) occurs within that time.
Clicks that carry no click count (`event.detail === 0`, e.g. keyboard activation of a button) cannot be part of a double click, so `onClick` runs immediately for them and `onDoubleClick` is not called.

## Interface

```ts
function useDoubleClick<E extends HTMLElement>(
  props: Object
): (event: MouseEvent<E>) => void;
```

### Parameters

<Interface
  required
  name="props"
  type="Object"
  description="Configuration options for click handling."
  :nested="[
    {
      name: 'props.delayMs',
      type: 'number',
      required: false,
      defaultValue: '250',
      description:
        'The number of milliseconds a pointer single click waits for a possible second click before <code>onClick</code> runs. Clicks without a click count (<code>event.detail === 0</code>) run <code>onClick</code> immediately and ignore <code>delayMs</code>. Defaults to 250ms.',
    },
    {
      name: 'props.onClick',
      type: '(event: MouseEvent<E>) => void',
      required: false,
      description: 'The callback function to be executed on a single click.',
    },
    {
      name: 'props.onDoubleClick',
      type: '(event: MouseEvent<E>) => void',
      required: true,
      description:
        'The callback function to be executed on a double click. Required.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="(event: MouseEvent<E>) => void"
  description="A click handler function to attach to an element's <code>onClick</code> event."
/>

## Example

```tsx
function GalleryCard() {
  const [selected, setSelected] = useState(false);

  const handleClick = () => setSelected(prev => !prev);
  const handleDoubleClick = () => alert('Zoom in!');

  const handleEvent = useDoubleClick({
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
  });

  return (
    <div onClick={handleEvent}>{selected ? 'Selected' : 'Not selected'}</div>
  );
}
```
