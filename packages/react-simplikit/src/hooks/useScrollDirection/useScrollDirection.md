# useScrollDirection

`useScrollDirection` is a React hook that detects scroll direction. It returns scroll direction (up/down) and current scroll position. Throttled by default (50ms) for performance.

## Interface

```ts
function useScrollDirection(
  options: UseScrollDirectionOptions
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
  description="direction state: <code>direction</code> (<code>'up' | 'down' | null</code>) and <code>position</code> (px)."
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
