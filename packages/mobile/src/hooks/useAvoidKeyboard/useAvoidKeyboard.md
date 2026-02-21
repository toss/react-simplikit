# useAvoidKeyboard

A React hook that helps fixed-bottom elements smoothly avoid the on-screen keyboard. When the keyboard appears, it moves the element upward using `transform` with a smooth transition.

## Interface

```ts
function useAvoidKeyboard(
  options?: UseAvoidKeyboardOptions
): UseAvoidKeyboardResult;
```

### Parameters

<Interface
  name="options"
  type="UseAvoidKeyboardOptions"
  description="Options to configure the keyboard avoidance behavior."
  :nested="[
    {
      name: 'options.safeAreaBottom',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        'Base bottom offset in pixels when the keyboard is hidden. Useful for accounting for the iPhone home indicator area.',
    },
    {
      name: 'options.transitionDuration',
      type: 'number',
      required: false,
      defaultValue: '200',
      description:
        'Transition duration in milliseconds for smooth animation.',
    },
    {
      name: 'options.transitionTimingFunction',
      type: 'string',
      required: false,
      description:
        'Transition timing function for the animation. Defaults to <code>ease-out</code>.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      description:
        'If <code>true</code>, gets the current keyboard height immediately on mount. Defaults to <code>true</code>.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="UseAvoidKeyboardResult"
  description="An object containing the CSS style for keyboard avoidance."
  :nested="[
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'CSS style object to apply to the fixed-bottom element. Contains <code>transform</code> and <code>transition</code> properties.',
    },
  ]"
/>

## Example

```tsx
function FixedBottomCTA() {
  const { style } = useAvoidKeyboard();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

```tsx
// With safe area bottom offset (e.g., for iPhone home indicator)
function FixedBottomCTA() {
  const { style } = useAvoidKeyboard({ safeAreaBottom: 34 });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```
