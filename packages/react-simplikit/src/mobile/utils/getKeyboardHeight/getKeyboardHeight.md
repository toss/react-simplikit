# getKeyboardHeight

`getKeyboardHeight` is a utility function that returns the current on-screen keyboard height in pixels. This function uses the Visual Viewport API to calculate the keyboard height. It assumes a modern environment where Visual Viewport is supported (Safari / WKWebView 14+, Chrome / Android WebView 80+). The keyboard height is computed as: `window.innerHeight - visualViewport.height - visualViewport.offsetTop` The subtraction of `offsetTop` is required to correctly handle iOS behavior where the visual viewport may shift vertically when the keyboard appears.

## Interface

```ts
function getKeyboardHeight(): number;
```

### Parameters

### Return Value

<Interface
  name=""
  type="number"
  description="keyboard height in pixels. Returns 0 if the keyboard is not visible."
/>

## Example

```tsx
const height = getKeyboardHeight();

if (height > 0) {
  footer.style.paddingBottom = `${height}px`;
}
```
