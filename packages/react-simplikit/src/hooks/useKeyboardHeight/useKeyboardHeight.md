# useKeyboardHeight

`useKeyboardHeight` is a React hook that tracks the on-screen keyboard height.
It returns the current keyboard height in pixels, which updates automatically
when the keyboard appears, disappears, or changes size.

## Interface

```ts
function useKeyboardHeight(options?: UseKeyboardHeightOptions): number;
```

### Parameters

<Interface
  name="options"
  type="UseKeyboardHeightOptions"
  description="Configuration options."
  :nested="[
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
  type="number"
  description="The current keyboard height in pixels. 0 when the keyboard is hidden."
/>

## Example

```tsx
function ChatInput() {
  const keyboardHeight = useKeyboardHeight();

  return (
    <div style={{ paddingBottom: `${keyboardHeight}px` }}>
      <input type="text" placeholder="Type a message..." />
    </div>
  );
}
```

```tsx
function KeyboardStatus() {
  const keyboardHeight = useKeyboardHeight();

  return (
    <div>
      {keyboardHeight > 0
        ? `Keyboard is open (${keyboardHeight}px)`
        : 'Keyboard is closed'}
    </div>
  );
}
```
