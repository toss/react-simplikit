# subscribeKeyboardHeight

`subscribeKeyboardHeight` is a utility function that subscribes to changes in the on-screen keyboard height. The provided callback is invoked whenever the keyboard height may change, including when the keyboard appears, disappears, or changes size. Internally, this function listens to both `resize` and `scroll` events on the Visual Viewport: - `resize`: triggered when the visual viewport height changes - `scroll`: triggered when the visual viewport offset changes (important for iOS where the viewport can shift without resizing) Performance optimizations: - Throttled by default (16ms, ~60fps) to prevent excessive callback invocations - Skips callback when height hasn't changed (deduplication)

## Interface

```ts
function subscribeKeyboardHeight(
  options: SubscribeKeyboardHeightOptions
): SubscribeKeyboardHeightResult;
```

### Parameters

<Interface
  required
  name="options"
  type="SubscribeKeyboardHeightOptions"
  description="Configuration options"
  :nested="[
    {
      name: 'options.callback',
      type: '(height: number) => void',
      required: true,
      description:
        'A function that will be called with the updated keyboard height in pixels.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'If true, the callback will be invoked immediately with the current keyboard height.',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '16',
      description: 'Throttle interval in milliseconds.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="SubscribeKeyboardHeightResult"
  description="object containing the unsubscribe function."
  :nested="[
    {
      name: 'unsubscribe',
      type: '() => void',
      required: false,
      description:
        'Unsubscribes all listeners and stops receiving keyboard height updates..',
    },
  ]"
/>

## Example

```tsx
const { unsubscribe } = subscribeKeyboardHeight({
  callback: height => {
    footer.style.paddingBottom = `${height}px`;
  },
  immediate: true,
});

// Later, when cleanup is needed
unsubscribe();
```
