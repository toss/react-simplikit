# getSafeAreaInset

`getSafeAreaInset` is a utility function that returns all safe area insets in pixels as an object. This function reads the CSS `env(safe-area-inset-*)` values by creating a temporary DOM element and reading its computed style. Safe area insets account for device-specific UI elements: - **top**: Notch, Dynamic Island, or status bar - **bottom**: Home indicator on Face ID devices - **left/right**: Rounded corners in landscape mode Typical values (iPhone with Face ID, portrait mode): - top: 47-59px (notch/Dynamic Island) - bottom: 34px (home indicator) - left/right: 0px

## Interface

```ts
function getSafeAreaInset(): SafeAreaInset;
```

### Parameters

### Return Value

<Interface
  name=""
  type="SafeAreaInset"
  description="containing safe area insets for all four sides, or all 0 if not available."
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description: 'Top safe area inset in pixels.',
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description: 'Bottom safe area inset in pixels.',
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description: 'Left safe area inset in pixels.',
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description: 'Right safe area inset in pixels.',
    },
  ]"
/>

## Example

```tsx
const { top, bottom, left, right } = getSafeAreaInset();

header.style.paddingTop = `${top}px`;
footer.style.paddingBottom = `${bottom}px`;
```
