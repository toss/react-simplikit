# useSafeAreaInset

React hook to track safe area inset changes.

Returns the safe area insets that automatically update when the screen orientation changes (e.g., portrait to landscape).

Safe area insets account for device-specific UI elements:
- **top**: Notch, Dynamic Island, or status bar
- **bottom**: Home indicator on Face ID devices
- **left/right**: Rounded corners in landscape mode

## Interface

### Parameters

This hook takes no parameters.

### Return Value

Returns an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `top` | `number` | Top safe area inset in pixels (notch, Dynamic Island, or status bar) |
| `bottom` | `number` | Bottom safe area inset in pixels (home indicator on Face ID devices) |
| `left` | `number` | Left safe area inset in pixels (rounded corners in landscape mode) |
| `right` | `number` | Right safe area inset in pixels (rounded corners in landscape mode) |

#### Typical Values (iPhone with Face ID, Portrait)

| Property | Typical Value | Description |
|----------|---------------|-------------|
| `top` | 47-59px | Notch or Dynamic Island |
| `bottom` | 34px | Home indicator |
| `left` | 0px | No obstruction in portrait |
| `right` | 0px | No obstruction in portrait |

## Example

### Basic Usage

```tsx
function MyComponent() {
  const safeArea = useSafeAreaInset();

  return (
    <div style={{
      paddingTop: safeArea.top,
      paddingBottom: safeArea.bottom,
      paddingLeft: safeArea.left,
      paddingRight: safeArea.right,
    }}>
      Content that respects safe areas
    </div>
  );
}
```

### Rotation-Aware Header

```tsx
// Automatically updates when screen rotates
function RotationAwareHeader() {
  const { top, left, right } = useSafeAreaInset();

  return (
    <header style={{
      paddingTop: top,
      paddingLeft: left,
      paddingRight: right,
    }}>
      Header content
    </header>
  );
}
```

### Fixed Bottom Navigation

```tsx
function BottomNavigation() {
  const { bottom } = useSafeAreaInset();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: bottom,
    }}>
      <NavItem icon="home" />
      <NavItem icon="search" />
      <NavItem icon="profile" />
    </nav>
  );
}
```

## Notes

- **SSR Safety**: Returns `{ top: 0, bottom: 0, left: 0, right: 0 }` on SSR. No null check needed.
- **Automatic Updates**: Insets update automatically on orientation changes via `resize` and `orientationchange` events.
- **Performance**: Uses React's `startTransition` to prevent blocking updates during orientation changes.
- **CSS Alternative**: For static layouts, consider using CSS `env(safe-area-inset-*)` directly.
- **Use Cases**:
  - Creating full-screen layouts that respect device notches
  - Building fixed headers and footers
  - Handling landscape mode with proper padding
  - Supporting devices with Dynamic Island
