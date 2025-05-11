# useEventListener

`useEventListener` is a React hook that attaches an event listener to a DOM element. It helps manage DOM event listeners in a clean, type-safe way with automatic cleanup and stable callback references.

## Interface

```ts
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = any,
>(
  type: K,
  listener: (event: HTMLElementEventMap[K]) => any,
  options?: AddEventListenerOptions
): Ref<T>;
```

### Parameters

<Interface
  required
  name="type"
  type="K"
  description="The event type to listen for (e.g., 'click', 'keydown')."
/>

<Interface
  required
  name="listener"
  type="(event: HTMLElementEventMap[K]) => any"
  description="The callback function to be called when the event occurs."
/>

<Interface
  name="options"
  type="AddEventListenerOptions"
  description="Optional options object for the event listener (e.g., capture, once, passive)."
/>

### Return Value

<Interface
  name=""
  type="Ref<T>"
  description="A React ref object that should be assigned to the target DOM element."
/>

## Example

```tsx
function LoggerButton() {
  const [count, setCount] = useState(0);
  const buttonRef = useEventListener('click', () => {
    setCount(prev => prev + 1);
  });

  return <button ref={buttonRef}>{count}</button>;
}
```
