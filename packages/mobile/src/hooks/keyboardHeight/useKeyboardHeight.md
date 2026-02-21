# useKeyboardHeight

A React hook that tracks the on-screen keyboard height in real time. It automatically updates when the keyboard appears, disappears, or changes size.

## Interface

```ts
function useKeyboardHeight(
  options?: UseKeyboardHeightOptions
): UseKeyboardHeightResult;
```

### Parameters

<Interface
  name="options"
  type="UseKeyboardHeightOptions"
  description="Options to configure the keyboard height tracking behavior."
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'If <code>true</code>, gets the current keyboard height immediately on mount.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="UseKeyboardHeightResult"
  description="An object containing the keyboard height information."
  :nested="[
    {
      name: 'keyboardHeight',
      type: 'number',
      description:
        'The current keyboard height in pixels. Returns <code>0</code> when the keyboard is closed.',
    },
  ]"
/>

## Example

```tsx
function ChatInput() {
  const { keyboardHeight } = useKeyboardHeight();

  return (
    <div style={{ paddingBottom: `${keyboardHeight}px` }}>
      <input type="text" placeholder="Type a message..." />
    </div>
  );
}
```

```tsx
function KeyboardStatus() {
  const { keyboardHeight } = useKeyboardHeight();

  return (
    <div>
      {keyboardHeight > 0
        ? `Keyboard is open (${keyboardHeight}px)`
        : 'Keyboard is closed'}
    </div>
  );
}
```
