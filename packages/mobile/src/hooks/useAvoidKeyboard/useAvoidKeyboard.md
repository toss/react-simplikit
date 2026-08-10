# useAvoidKeyboard

`useAvoidKeyboard` is a React hook that helps fixed-bottom elements avoid the on-screen keyboard. It returns a CSS style that can be applied to `position: fixed` elements to smoothly move them above the keyboard when it appears.

## Interface

```ts
function useAvoidKeyboard(
  options: UseAvoidKeyboardOptions
): UseAvoidKeyboardResult;
```

### Parameters

<Interface
  name="options"
  type="UseAvoidKeyboardOptions"
  description="Configuration options."
  :nested="[
    {
      name: 'options.safeAreaBottom',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: 'Base bottom offset in pixels when keyboard is hidden.',
    },
    {
      name: 'options.transitionDuration',
      type: 'number',
      required: false,
      defaultValue: '200',
      description: 'Transition duration in milliseconds for smooth animation.',
    },
    {
      name: 'options.transitionTimingFunction',
      type: 'CSSProperties[\'transitionTimingFunction\']',
      required: false,
      defaultValue: '\'ease-out\'',
      description: 'Transition timing function for the animation.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: 'If true, gets the initial keyboard height on mount.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="UseAvoidKeyboardResult"
  description="object containing the <code>style</code> property to apply to the fixed bottom element."
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
