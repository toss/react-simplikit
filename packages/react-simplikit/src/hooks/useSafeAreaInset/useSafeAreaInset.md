# useSafeAreaInset

`useSafeAreaInset` is a React hook that tracks safe area inset changes. It returns the safe area insets that automatically update when the screen orientation changes (e.g., portrait to landscape).

Safe area insets account for device-specific UI elements:

- **top**: Notch, Dynamic Island, or status bar
- **bottom**: Home indicator on Face ID devices
- **left/right**: Rounded corners in landscape mode

## Interface

```ts
function useSafeAreaInset(): SafeAreaInset;
```

### Parameters

### Return Value

<Interface
  name=""
  type="SafeAreaInset"
  description="object containing safe area insets for all four sides."
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description:
        'Top safe area inset in pixels. Accounts for the notch, Dynamic Island, or status bar.',
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description:
        'Bottom safe area inset in pixels. Accounts for the home indicator on Face ID devices.',
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description:
        'Left safe area inset in pixels. Accounts for rounded corners in landscape mode.',
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description:
        'Right safe area inset in pixels. Accounts for rounded corners in landscape mode.',
    },
  ]"
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
