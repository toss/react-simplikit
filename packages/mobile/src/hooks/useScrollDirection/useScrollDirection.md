# useScrollDirection

React hook to detect scroll direction.

Returns scroll direction (up/down) and current scroll position. Throttled by default (50ms) for performance optimization.

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
  description="Configuration options for scroll direction detection."
  :nested="[
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '50',
      description: 'Throttle interval in milliseconds to limit scroll event handling frequency',
    },
  ]"
/>

### Return Value

<Interface
name=""
type="ScrollDirectionState"
description="object with scroll direction and position."
:nested="[
{
name: 'direction',
type: \"'up' | 'down' | null\",
required: false,
description: 'Current scroll direction. <code>null</code> on initial render',
},
{
name: 'position',
type: 'number',
required: false,
description: 'Current vertical scroll position in pixels',
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

### Custom Throttle Interval

```tsx
function MyComponent() {
  // Update every 100ms instead of default 50ms
  const { direction, position } = useScrollDirection({ throttleMs: 100 });

  return (
    <div>
      Scrolling {direction}! Position: {position}px
    </div>
  );
}
```

## Notes

- **SSR Safety**: The hook safely handles server-side rendering by checking `isServer()` before accessing `window.scrollY`
- **Performance**: Uses throttling to limit scroll event handling frequency (default: 50ms)
- **Passive Listeners**: Scroll event listener uses `{ passive: true }` for better scrolling performance
- **Cleanup**: Automatically removes event listeners and clears timers on component unmount
- **Browser Support**: Requires browser environment with `window` and `scrollY` support
