# useDoubleClick

`useDoubleClick` is a React hook that differentiates between single and double click events. It delays the single click callback execution for a specified time, and cancels it if a second click (i.e. a double click) occurs within that time.

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
      name: 'props.delay',
      type: 'number',
      required: false,
      defaultValue: '250',
      description:
        'The number of milliseconds to wait before triggering the single click callback. Defaults to 250ms.',
    },
    {
      name: 'props.click',
      type: '(event: MouseEvent<E>) => void',
      required: false,
      description: 'The callback function to be executed on a single click.',
    },
    {
      name: 'props.doubleClick',
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
  description="click handler function to attach to an element's <code>onClick</code> event."
/>

## Example

```tsx
function GalleryCard() {
  const [selected, setSelected] = useState(false);

  const handleClick = () => setSelected(prev => !prev);
  const handleDoubleClick = () => alert('Zoom in!');

  const handleEvent = useDoubleClick({
    click: handleClick,
    doubleClick: handleDoubleClick,
  });

  return (
    <div onClick={handleEvent}>{selected ? 'Selected' : 'Not selected'}</div>
  );
}
```
