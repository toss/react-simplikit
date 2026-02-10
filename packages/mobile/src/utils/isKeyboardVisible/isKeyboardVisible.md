# isKeyboardVisible

`isKeyboardVisible` is a utility function that checks whether the on-screen keyboard is currently visible. This function uses `getKeyboardHeight()` internally and returns `true` if the keyboard height is greater than 0.

## Interface

```ts
function isKeyboardVisible(): boolean;
```

### Parameters

### Return Value

<Interface
  name=""
  type="boolean"
  description="if the keyboard is visible, <code>false</code> otherwise."
/>

## Example

```tsx
if (isKeyboardVisible()) {
  console.log('Keyboard is open');
} else {
  console.log('Keyboard is closed');
}
```
