# useSafeAreaInset

A React hook that tracks device safe area insets in real time. It automatically updates when the screen orientation changes (e.g., portrait to landscape).

Safe area insets account for device-specific UI elements:

- **top**: Notch, Dynamic Island, or status bar
- **bottom**: Home indicator on Face ID devices
- **left/right**: Rounded corners in landscape mode

## Interface

```ts
function useSafeAreaInset(): SafeAreaInset;
```

### Parameters

This hook does not accept any parameters.

### Return Value

<Interface
  name=""
  type="SafeAreaInset"
  description="An object containing safe area insets for all four sides."
  :nested="[
    {
      name: 'top',
      type: 'number',
      description:
        'Top safe area inset in pixels. Accounts for the notch, Dynamic Island, or status bar.',
    },
    {
      name: 'bottom',
      type: 'number',
      description:
        'Bottom safe area inset in pixels. Accounts for the home indicator on Face ID devices.',
    },
    {
      name: 'left',
      type: 'number',
      description:
        'Left safe area inset in pixels. Accounts for rounded corners in landscape mode.',
    },
    {
      name: 'right',
      type: 'number',
      description:
        'Right safe area inset in pixels. Accounts for rounded corners in landscape mode.',
    },
  ]"
/>

## Example

```tsx
function SafeLayout() {
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

```tsx
// Automatically updates when screen rotates
function RotationAwareHeader() {
  const { top, left, right } = useSafeAreaInset();

  return (
    <header
      style={{
        paddingTop: top,
        paddingLeft: left,
        paddingRight: right,
      }}
    >
      Header content
    </header>
  );
}
```
