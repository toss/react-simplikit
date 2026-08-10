# useSafeAreaInset

`useSafeAreaInset` is a React hook that tracks safe area inset changes. It returns the safe area insets that automatically update when the screen orientation changes (e.g., portrait to landscape). Safe area insets account for device-specific UI elements: - **top**: Notch, Dynamic Island, or status bar - **bottom**: Home indicator on Face ID devices - **left/right**: Rounded corners in landscape mode

## Interface

```ts
function useSafeAreaInset(): SafeAreaInset;
```

### Parameters

### Return Value

<Interface
  name=""
  type="SafeAreaInset"
  description="containing safe area insets for all four sides."
/>

## Example

```tsx
function MyComponent() {
  const safeArea = useSafeAreaInset();

  return (
    <div
      style={{
        paddingTop: safeArea.top,
        paddingBottom: safeArea.bottom,
        paddingLeft: safeArea.left,
        paddingRight: safeArea.right,
      }}
    >
      Content that respects safe areas
    </div>
  );
}
```
