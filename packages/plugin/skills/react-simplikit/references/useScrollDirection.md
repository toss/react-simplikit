# useScrollDirection

`useScrollDirection` is a React hook that detects scroll direction. It returns scroll direction (up/down) and current scroll position. Throttled by default (50ms) for performance.

## Interface

```ts
function useScrollDirection(
  options?: UseScrollDirectionOptions
): ScrollDirectionState;
```

### Parameters

<Interface
  name="options"
  type="UseScrollDirectionOptions"
  description="Configuration options."
  :nested="[
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '50',
      description: 'Throttle interval in milliseconds.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="ScrollDirectionState"
  description="An object containing the scroll direction and position."
  :nested="[
    {
      name: 'direction',
      type: '\'up\' | \'down\' | null',
      required: false,
      description:
        'The current scroll direction. <code>null</code> on the initial render.',
    },
    {
      name: 'position',
      type: 'number',
      required: false,
      description: 'The current vertical scroll position in pixels.',
    },
  ]"
/>

## Example

```tsx
function Header() {
  const { direction, position } = useScrollDirection();

  // Hide header on scroll down
  const isHidden = direction === 'down' && position > 100;

  return <header className={isHidden ? 'hidden' : 'visible'}>My Header</header>;
}
```

### Custom throttle interval

```tsx
function MyComponent() {
  // Update every 100ms instead of the default 50ms
  const { direction, position } = useScrollDirection({ throttleMs: 100 });

  return (
    <div>
      Scrolling {direction}! Position: {position}px
    </div>
  );
}
```

## Notes

- **SSR safety**: The hook checks `isServer()` before reading `window.scrollY`, so it is safe during server-side rendering.
- **Performance**: Scroll events are throttled to limit how often they are processed (default: 50ms).
- **Passive listener**: The scroll listener is registered with `{ passive: true }` for smoother scrolling.
- **Cleanup**: The event listener and the throttle timer are removed when the component unmounts.
- **Browser support**: Requires a browser environment with `window` and `scrollY`.
